import configAxios from "../services/axiosConfig";
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Checkbox } from "../components/ui/Checkbox"
import { Tabs } from "../components/ui/Tabs"
import DashboardLayout from "../components/DashboardLayout"
import { 
  validatePersonalInfo, 
  validatePasswordChange, 
  validatePreferences 
} from "../utils/validateUserInfo";
import { updateUser } from "../redux/slices/authSlice";

function SettingsPage() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("personal")

  const [personalInfo, setPersonalInfo] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
  });
  const [personalErrors, setPersonalErrors] = useState({});

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState({});

  const categories = ["Sports", "Politics", "Technology", "Space", "Health", "Entertainment", "Science", "Business"]
  const [selectedCategories, setSelectedCategories] = useState(user.preferences || []);
  const [preferenceError, setPreferenceError] = useState(null);


  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
    setPersonalErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", 
    }));
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
    setPasswordErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", 
    }));
  }

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
    setPreferenceError(null);
  }

  const savePersonalInfo = async () => {
    console.log("update profile");
    const errors = validatePersonalInfo(personalInfo);
    if(Object.keys(errors).length > 0) {
      setPersonalErrors(errors);
      return;
    }
    try {
      const response = await configAxios.patch("/api/users/update-profile", personalInfo); 
      dispatch(updateUser(response.data.user));     
      toast.success("Personal info Updated Successfully!", { position: "top-center" });
    } catch (error) {      
      toast.error("Error updating personal info!", { position: "top-center" });
    }
  }

  const updatePassword = async () => {
    const errors = validatePasswordChange(passwordInfo);
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    try {
      const response = await configAxios.patch("/api/users/change-password", passwordInfo);   
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });   
      toast.success("Password Reset Successfully!", { position: "top-center" });
    } catch (error) {     
      toast.error(error.response.data.message, { position: "top-center" });
    }
  }

  const savePreferences = async () => {
    const error = validatePreferences(selectedCategories);
    if (error) {
      setPreferenceError(error);
      return;
    }
    try {
      const response = await configAxios.patch("/api/users/update-preferences", { preferences: selectedCategories });
      toast.success("Preferences Updated Successfully!", { position: "top-center" });
      dispatch(updateUser(response.data.user));
    } catch (error) {
      toast.error("Error updating preferences!", { position: "top-center" });
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Tabs>
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                activeTab === "personal" ? "bg-white shadow" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Information
            </button>
            <button
              type="button"
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                activeTab === "preferences" ? "bg-white shadow" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("preferences")}
            >
              Article Preferences
            </button>
          </div>

          {activeTab === "personal" ? (
            <>
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-bold">Personal Information</h2>
                  <p className="text-sm text-gray-500">Update your personal details and account information</p>
                </div>
                <div className="p-6 pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                      />
                      {personalErrors.firstName && <p className="text-red-500 text-xs">{personalErrors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                      />
                      {personalErrors.lastName && <p className="text-red-500 text-xs">{personalErrors.lastName}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={user.email}
                      readOnly
                      className="bg-gray-200 cursor-not-allowed"                      
                    />
                  </div>
                  {personalErrors.email && <p className="text-red-500 text-xs">{personalErrors.email}</p>}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                    />
                    {personalErrors.phone && <p className="text-red-500 text-xs">{personalErrors.phone}</p>}
                  </div>
                  
                </div>
                <div className="p-6 pt-0">
                  <Button onClick={savePersonalInfo}>Save Changes</Button>
                </div>
              </Card>

              <Card className="mt-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold">Change Password</h2>
                  <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
                </div>
                <div className="p-6 pt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordInfo.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.currentPassword && <p className="text-red-500 text-xs">{passwordErrors.currentPassword}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordInfo.newPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.newPassword && <p className="text-red-500 text-xs">{passwordErrors.newPassword}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordInfo.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.confirmPassword && <p className="text-red-500 text-xs">{passwordErrors.confirmPassword}</p>}
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Button onClick={updatePassword}>Update Password</Button>
                </div>
              </Card>
            </>
          ) : (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold">Article Preferences</h2>
                <p className="text-sm text-gray-500">
                  Select the categories you're interested in to customize your feed
                </p>
                {preferenceError && <p className="text-red-500 text-sm text-center">{preferenceError}</p>}
              </div>
              <div className="p-6 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.toLowerCase()}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label htmlFor={category.toLowerCase()}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 pt-0">
                <Button onClick={savePreferences}>Save Preferences</Button>
              </div>
            </Card>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage

