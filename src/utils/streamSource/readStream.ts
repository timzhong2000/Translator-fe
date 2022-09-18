export function readFromScreen(config: MediaStreamConstraints) {
  return navigator.mediaDevices.getDisplayMedia(config);
}

export function readFromCamera(config: MediaStreamConstraints) {
  return navigator.mediaDevices.getUserMedia(config);
}
