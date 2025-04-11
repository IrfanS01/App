const fetchHelper = async (endpoint, method = "GET", body = null, auth = true) => {
    const headers = { "Content-Type": "application/json" };
  
    if (auth) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("🚫 Token nije pronađen u localStorage.");
        throw new Error("Korisnik nije prijavljen.");
      }
      headers["Authorization"] = `Bearer ${token}`;
    }
    

    console.log("🔎 Fetching:", {
      endpoint,
      method,
      headers,
      body,
      token: localStorage.getItem("token"),
    });
  
    const config = {
      method,
      headers,
    };
  
    if (body) {
      config.body = JSON.stringify(body);
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, config);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error from server.");
      }
  
      return { success: true, data };
    } catch (error) {
      console.error("FetchHelper error:", error);
      return { success: false, error: error.message };
    }
  };
  
  export default fetchHelper;
  