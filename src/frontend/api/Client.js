const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || (typeof body.detail === "string" ? body.detail : "") || "Request failed");
    }
    return res.status === 204 ? null : res.json();
}

export const getFarms = () => request("/farms");

// returns { referenceCode }
export const submitRegistration = (data) =>
    request("/registrations", { method: "POST", body: JSON.stringify(data) });

export const saveContactPreferences = (referenceCode, prefs) =>
    request(`/registrations/${referenceCode}/contact`, { method: "PATCH", body: JSON.stringify(prefs) });

export const submitFeedback = (data) =>
    request("/feedback", { method: "POST", body: JSON.stringify(data) });

// sends { fullName, email, topic, message }
export const submitInquiry = (data) =>
    request("/inquiries", { method: "POST", body: JSON.stringify(data) });

// crop predictor (FastAPI: GET /options and GET /predict)
export const getOptions = () => request("/options");

export const getPrediction = ({ region, quarter }) =>
    request(`/predict?${new URLSearchParams({ region, quarter })}`);