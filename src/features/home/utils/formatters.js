export const isFormatted = (followers) => {
  return typeof followers === "string" && (followers.includes("k") || followers.includes("M"));
};

export const formatFollowers = (count) => {
  if (typeof count === "number") {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(0) + "K";
    }
  }
  return count;
};