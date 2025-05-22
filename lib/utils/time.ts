export const formatDuration = (duration: number) => {
  const days = Math.floor(duration / 3600 / 24);
  const hours = Math.floor((duration / 3600) % 24);
  const minutes = Math.floor((duration / 60) % 60);
  const seconds = Math.floor(duration % 60);

  let result = "";

  if (days > 0) {
    if (days !== 1 && days !== 7) result += `${days} days`;
    if (days === 1) result += `${days} day`;
    if (days === 7) result += `${days / 7} week`;
  }

  if (hours > 0) {
    if (hours === 1) result += `${hours} hour`;
    result += `${hours} hours`;
  }

  if (minutes > 0) {
    if (minutes === 1) result += `${minutes} minute`;
    result += `${minutes} minutes`;
  }

  if (seconds > 0) {
    if (seconds === 1) result += `${seconds} second`;
    result += `${seconds} seconds`;
  }

  return result;
};

export const currentTime = () => {
  return Math.floor(Date.now() / 1000);
};
