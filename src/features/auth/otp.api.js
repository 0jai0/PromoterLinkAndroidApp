// services/otp.api.js
import API from "../../api/config"; // This is an Axios instance

/**
 * Send OTP to user's email
 * @param {string} email - User's email address
 * @returns {Promise} Axios response
 */
export const sendOtp = async (email) => {
  try {
    console.log('Sending OTP to:', email);
    
    const response = await API.post('/api/otp/send-otp', { 
      userId: email
    });
    
    console.log("OTP sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("OTP send error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw handleOtpError(error);
  }
};

/**
 * Verify OTP entered by user
 * @param {string} email - User's email address
 * @param {string} otp - OTP code entered by user
 * @returns {Promise} Verification result
 */
export const verifyOtp = async (email, otp) => {
  try {
    console.log('Verifying OTP for:', email);
    
    // First try to get OTP details
    const response = await API.get('/api/otp/userId', {
      params: {
        userId: email,
      },
    });
    
    console.log("OTP verification response:", response.data);
    
    // Compare the OTP from response with user input
    const isVerified = otp === response.data.otpDetails.otp;
    
    return {
      success: isVerified,
      data: response.data
    };
  } catch (error) {
    console.error("OTP verification error:", error);
    
    // If the first method fails, try alternative verification endpoint
    try {
      console.log("Trying alternative verification method...");
      const altResponse = await API.post('/api/otp/verify', {
        userId: email,
        otp: otp
      });
      
      return {
        success: altResponse.data.success || altResponse.data.verified,
        data: altResponse.data
      };
    } catch (altError) {
      console.error("Alternative verification also failed:", altError);
      throw handleOtpError(error);
    }
  }
};

/**
 * Handle OTP-related errors
 */
const handleOtpError = (error) => {
  console.log("Error details:", {
    response: error.response,
    message: error.message,
    code: error.code
  });
  
  if (error.response) {
    // Server responded with error status
    if (error.response.status === 404) {
      return new Error("Email already registered. Please login instead.");
    } else if (error.response.status === 400) {
      return new Error("Invalid email format.");
    } else if (error.response.status === 429) {
      return new Error("Too many attempts. Please try again later.");
    } else if (error.response.data && error.response.data.message) {
      return new Error(error.response.data.message);
    } else if (error.response.status === 500) {
      return new Error("Server error. Please try again later.");
    }
  } else if (error.request) {
    // Request was made but no response received
    if (error.code === 'ECONNABORTED') {
      return new Error("Request timeout. Please check your connection.");
    }
    return new Error("Network error. Please check your connection.");
  }
  
  // Generic error
  return new Error("OTP operation failed. Please try again.");
};

/**
 * Test API connection
 */
export const testOtpApi = async (email) => {
  console.log("Testing OTP API connection...");
  
  try {
    // Test if server is reachable
    const testResponse = await API.get('/api/health');
    console.log("Server health check:", testResponse.data);
    
    // Test OTP endpoint
    const otpResponse = await sendOtp(email);
    console.log("OTP test successful:", otpResponse);
    
    return { success: true, message: "API is working correctly" };
  } catch (error) {
    console.error("API test failed:", error);
    return { 
      success: false, 
      message: error.message,
      details: error.response?.data 
    };
  }
};