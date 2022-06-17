const detectMobile = () => {
  return (
    navigator.userAgent.toLowerCase().includes("mobile") ||
    navigator.userAgent.toLowerCase().includes("phone") ||
    navigator.userAgent.toLowerCase().includes("ios") ||
    navigator.userAgent.toLowerCase().includes("android") ||
    navigator.userAgent.toLowerCase().includes("windows phone")
  );
};

const isMobile = detectMobile();

if (isMobile) {
  const button = document.querySelector("#enter-button");
  const details = document.querySelector("details");
  button.remove();
  details.remove();

  const container = document.querySelector("#subcontainer");
  const message = document.createElement("p");
  message.classList.add("warning");
  message.textContent =
    "Sorry, this application is not designed for mobile devices.";

  container.appendChild(message);
}
