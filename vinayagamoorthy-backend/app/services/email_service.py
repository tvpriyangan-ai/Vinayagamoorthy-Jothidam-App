"""
Email delivery via plain SMTP -- works with a free Gmail account (using an
App Password, not your real password) or any other SMTP provider, so you
don't need to sign up for a paid transactional email service just to send
OTP codes. Swap this for SendGrid/SES/etc. later if volume grows.
"""
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings


def send_email(to_address: str, subject: str, body: str) -> bool:
    """Returns True if sent, False if email isn't configured or sending failed.
    Never raises -- a failed/unconfigured email should not break the OTP flow;
    the caller logs/handles the False case."""
    if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        return False

    message = MIMEMultipart()
    message["From"] = settings.SMTP_FROM_ADDRESS or settings.SMTP_USER
    message["To"] = to_address
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain", "utf-8"))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(message["From"], to_address, message.as_string())
        return True
    except Exception:
        return False


def build_otp_email(otp: str) -> tuple[str, str]:
    subject = "Vinayagamoorthy Jothidam -- OTP"
    body = (
        f"உங்கள் கடவுச்சொல் மீட்டமைப்பு OTP: {otp}\n\n"
        f"இந்த OTP {settings.OTP_EXPIRE_MINUTES} நிமிடங்களுக்கு மட்டுமே செல்லுபடியாகும்.\n"
        f"நீங்கள் இதைக் கோரவில்லை எனில், இந்த மின்னஞ்சலை புறக்கணிக்கவும்.\n\n"
        f"-- Vinayagamoorthy Jothidam"
    )
    return subject, body
