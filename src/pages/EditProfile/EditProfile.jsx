import "./EditProfile.scss";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { DriveFolderUploadOutlined } from "@mui/icons-material";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import {v4 as uuid} from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {

  const [img, setImg] = useState(null);
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    name: "",
    newEmail: "",
    phone: "",
    age: "",
    country: "",
    relationship: "",
    oldPassword: "",
  });
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (img) {
      const storageRef = ref(storage, "usersImages/" + uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(currentUser, {
              displayName: data.name,
              email: data.newEmail,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", currentUser.uid), {
              uid: currentUser.uid,
              photoURL: downloadURL,
              displayName: data.name,
              email: data.newEmail,
              phone: data.phone,
              age: data.age,
              country: data.country,
              relationship: data.relationship,
              createdAt: serverTimestamp(),
            });

            const credential = EmailAuthProvider.credential(
              currentUser.email,
              data.oldPassword
            );

            await reauthenticateWithCredential(currentUser, credential).then(
              async () => {
                //User reauthenticate
                await updateEmail(currentUser, data.newEmail);
              }
            );
          });
        }
      );
    } else {
      await updateProfile(currentUser, {
        displayName: data.name,
        email: data.newEmail,
      });

      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,

        displayName: data.name,
        email: data.newEmail,
        phone: data.phone,
        age: data.age,
        country: data.country,
        relationship: data.relationship,
        createdAt: serverTimestamp(),
      });

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        data.oldPassword
      );

      await reauthenticateWithCredential(currentUser, credential).then(
        async () => {
          //User reauthenticate
          await updateEmail(currentUser, data.newEmail);
        }
      );
    }
    navigate("/login");
  };

  return (
    <div className="editProfile">
      <Navbar />
      <div className="editProfileWrapper">
        <Sidebar />

        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src="/assets/profilecover/profilecover.jpg"
                alt=""
                className="profileCoverImg"
              />

              <img
                src={currentUser.photoURL}
                alt=""
                className="profileUserImg"
              />
            </div>

            <div className="profileInfo">
              <h4 className="profileInfoName">{currentUser.displayName}</h4>
              <span className="profileInfoDesc">Hi Friends!</span>
            </div>
          </div>
          <div className="editProfileRightBottom">
            <div className="top">
              <h1>Edit User Profile</h1>
            </div>
            <div className="bottom">
              <div className="left">
                <img src={img ? URL.createObjectURL(img) : "/assets/profileCover/DefaultProfile.jpg"} alt="" />
              </div>

              <div className="right">
                <form onSubmit={handleUpdate}>
                  <div className="formInput">
                    <label htmlFor="file">
                      Image: <DriveFolderUploadOutlined className="icon" />
                    </label>
                    <input type="file" hidden id="file" onChange={(e)=>setImg(e.target.files[0])}/>
                  </div>

                  <div className="formInput">
                    <label>Name</label>
                    <input type="text" name="name" placeholder="Jane Doe" onChange={handleChange}/>
                  </div>

                  <div className="formInput">
                    <label>Email</label>
                    <input type="email" name="newEmail" placeholder="jane_doe@gmail.com" onChange={handleChange}/>
                  </div>

                  <div className="formInput">
                    <label>Phone</label>
                    <input type="text" placeholder="+91 7777777777" name="phone" onChange={handleChange}/>
                  </div>

                  <div className="formInput">
                    <label>Age</label>
                    <input type="text" placeholder="Enter your age" name="age" onChange={handleChange}/>
                  </div>

                  <div className="formInput">
                    <label>Country</label>
                    <input type="text" placeholder="India" name="country" onChange={handleChange}/>
                  </div>

                  <div className="formInput">
                    <label>Relationship</label>
                    <input type="text" placeholder="Enter your relationship status" name="relationship" onChange={handleChange}/>
                  </div>

                  <div className="formInput">
                    <label>Password</label>
                    <input type="password" placeholder="Enter your Old Password" name="oldPassword" onChange={handleChange}/>
                  </div>

                  <button type="submit" className="updateButton">
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
