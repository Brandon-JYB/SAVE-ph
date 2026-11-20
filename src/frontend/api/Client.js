const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(path, options) {
    let res;
    try {
        res = await fetch(`${BASE_URL}${path}`, {
            headers: { "Content-Type": "application/json" },
            ...options,
        });
    } catch {
        throw new Error("Can't reach the server. Check your connection and try again.");
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        // FastAPI sends { detail: "message" } or, for validation errors, { detail: [{ msg }] }
        const detail = Array.isArray(body.detail)
            ? body.detail[0]?.msg?.replace(/^Value error, /, "")
            : body.detail;
        const message =
            body.message ||
            (typeof detail === "string" ? detail : "") ||
            "Request failed";
        throw new Error(message);
    }

    return res.status === 204 ? null : res.json();
}

// pass a YYYY-MM-DD date to get the spots left on that day
export const getFarms = (date) =>
    request(date ? `/farms?date=${encodeURIComponent(date)}` : "/farms");

// returns { referenceCode }
export const submitRegistration = (data) =>
    request("/registrations", { method: "POST", body: JSON.stringify(data) });

export const saveContactPreferences = (referenceCode, prefs) =>
    request(`/registrations/${referenceCode}/contact`, {
        method: "PATCH",
        body: JSON.stringify(prefs),
    });

export const submitFeedback = (data) =>
    request("/feedback", { method: "POST", body: JSON.stringify(data) });

// sends { fullName, email, topic, message }
export const submitInquiry = (data) =>
    request("/inquiries", { method: "POST", body: JSON.stringify(data) });

// crop predictor (FastAPI: GET /options and GET /predict)
export const getOptions = () => request("/options");

export const getPrediction = (params) =>
    request(`/predict?${new URLSearchParams(params)}`);