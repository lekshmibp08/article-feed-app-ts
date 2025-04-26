export const validatePersonalInfo = (data) => {
    const errors = {};
    
    if (!data.firstName.trim()) errors.firstName = "First name is required.";
    if (!data.lastName.trim()) errors.lastName = "Last name is required.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(data.email)) {
      errors.email = "Invalid email format.";
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!data.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(data.phone)) {
      errors.phone = "Invalid phone number. Must be 10 digits.";
    }
  
    return errors;
};
  
  export const validatePasswordChange = (data) => {
    const errors = {};
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  
    if (!data.currentPassword.trim()) errors.currentPassword = "Current password is required.";
    if (!data.newPassword.trim()) {
      errors.newPassword = "New password is required.";
    } else if (!passwordRegex.test(data.newPassword)) {
        errors.newPassword = "Password must be at least 6 characters long and include a letter, a number, and a special character.";
    }
    if (data.newPassword !== data.confirmPassword) errors.confirmPassword = "Passwords do not match.";
  
    return errors;
};
  
  export const validatePreferences = (preferences) => {
    if (preferences.length === 0) return "At least one preference must be selected.";
    return null;
};
  