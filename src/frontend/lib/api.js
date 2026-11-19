const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(path) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`);
  } catch {
    throw new Error("Can't reach the prediction server. Please try again in a moment.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      typeof body.detail === "string"
        ? body.detail
        : "Something went wrong. Please try again."
    );
  }
  return res.json();
}

export const getOptions = () => request("/options");

export const getPrediction = (region, quarter) =>
  request(`/predict?region=${encodeURIComponent(region)}&quarter=${quarter}`);