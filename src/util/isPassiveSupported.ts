export default function isPassiveSupported() {
  let passiveSupported = false;

  try {
    const options = Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
      }
    });

    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch(err) {
    passiveSupported = false;
  }

  return passiveSupported;
}
