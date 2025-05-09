function otp() {
  console.log("OTP");
  if ("OTPCredential" in window) {
    console.log("OTPWindow");
    window.addEventListener("DOMContentLoaded", (e) => {
      const input = document.querySelector(
        'input[autocomplete="one-time-code"]'
      );
      if (!input) return;
      const ac = new AbortController();
      const form = input.closest("form");
      if (form) {
        form.addEventListener("submit", (e) => {
          ac.abort();
        });
      }
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp) => {
          input.value = otp.code;
          if (form) form.submit();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
