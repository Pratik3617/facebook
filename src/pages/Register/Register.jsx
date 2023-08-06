import { DriveFolderUploadOutlined } from "@mui/icons-material";
import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../../firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 

const Register = () => {
  const [img, setImg] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      let photoURL = "/assets/profileCover/DefaultProfile.jpg"; // Default image URL

      if (img) {
        // Use the selected image and create a temporary URL
        photoURL = URL.createObjectURL(img);

        // Upload the image to Firebase Storage
        const storageRef = ref(storage, "usersImages/" + displayName);
        await uploadBytesResumable(storageRef, img);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Now, the photoURL is the actual download URL from Firebase Storage
        photoURL = downloadURL;
      }

      // Update the profile with the user's display name and photo URL
      await updateProfile(result.user, {
        displayName,
        photoURL,
      });

      // Save user data to Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        displayName,
        email,
        photoURL,
      });

      // Initialize an empty messages array for the user
      await setDoc(doc(db, "usersPosts", result.user.uid), { messages: [] });

      // Initialize an empty messages array for the userChats
      await setDoc(doc(db, "usersChats", result.user.uid), { });

    } catch (error) {
      setError(true);
    }
    navigate("/login");
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">faceBook</h3>
          <span className="registerDesc">
            Connect with friends and world around you on facebook.
          </span>
        </div>

        <div className="registerRight">
          <div className="registerBox">
            <div className="top">
              <img
                src={
                  img
                    ? URL.createObjectURL(img)
                    : "/assets/profileCover/DefaultProfile.jpg"
                }
                alt=""
                className="profileImg"
              />

              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlined className="icon" />
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  hidden
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setImg(e.target.files[0])}
                />
              </div>
            </div>
            <div className="bottom">
              <form onSubmit={handleRegister} className="bottomBox">
                <input
                  type="text"
                  placeholder="Username"
                  id="username"
                  required
                  className="registerInput"
                />

                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  required
                  className="registerInput"
                />

                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  required
                  minLength={6}
                  className="registerInput"
                />
                

                <button type="submit" className="registerButton">
                  Sign Up
                </button>
                <Link to="/login">
                  <button className="loginRegisterButton">
                    Log into Account
                  </button>
                </Link>
                {error && <span style={{fontSize:"18px"}}>Something went wrong</span>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
