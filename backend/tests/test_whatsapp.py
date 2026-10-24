"""
Unit tests for WhatsApp Gateway Service and Inbound StandardWebhooks.
"""
import json
import time
import base64
import hmac
import hashlib
from app import create_app
from app.services.whatsapp_service import WhatsAppGatewayService

def test_whatsapp_config():
    app = create_app("testing")
    with app.app_context():
        cfg = WhatsAppGatewayService.get_config()
        assert "apiKey" in cfg
        assert "gatewayUrl" in cfg
        assert "webhookSecret" in cfg
        assert cfg["isTest"] is True or cfg["isLive"] is True

def test_whatsapp_test_connection():
    app = create_app("testing")
    with app.app_context():
        res = WhatsAppGatewayService.test_connection()
        assert res["success"] is True
        assert "latencyMs" in res

def test_whatsapp_send_template():
    app = create_app("testing")
    with app.app_context():
        res = WhatsAppGatewayService.send_template(
            to_phone="+918857830151",
            template_name="vaani_appointment_confirmation",
            parameters=["Aarav", "10:30 AM", "Ms. Palak Gandhi", "Satara"],
        )
        assert res["success"] is True
        assert "messageId" in res

def test_webhook_hmac_verification():
    app = create_app("testing")
    with app.app_context():
        cfg = WhatsAppGatewayService.get_config()
        secret = cfg["webhookSecret"]
        
        payload = {"event": "appointment.created", "bookingRef": "APT-TEST-01"}
        raw_bytes = json.dumps(payload).encode("utf-8")
        wh_id = f"evt_{int(time.time())}"
        wh_ts = str(int(time.time()))

        try:
            key_bytes = base64.b64decode(secret.replace("whsec_", ""))
        except Exception:
            key_bytes = secret.encode("utf-8")

        to_sign = f"{wh_id}.{wh_ts}.".encode("utf-8") + raw_bytes
        sig = "v1," + base64.b64encode(hmac.new(key_bytes, to_sign, hashlib.sha256).digest()).decode("utf-8")

        is_valid = WhatsAppGatewayService.verify_webhook_signature(
            raw_payload_bytes=raw_bytes,
            webhook_id=wh_id,
            webhook_timestamp=wh_ts,
            signature_header=sig,
        )
        assert is_valid is True

        # Test invalid signature
        is_invalid = WhatsAppGatewayService.verify_webhook_signature(
            raw_payload_bytes=raw_bytes,
            webhook_id=wh_id,
            webhook_timestamp=wh_ts,
            signature_header="v1,invalidsignature123",
        )
        assert is_invalid is False
