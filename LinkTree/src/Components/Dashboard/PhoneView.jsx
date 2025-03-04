import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./PhoneView.css";

const PhoneView = ({ bio = "", phoneHeaderColor = "#FFFFFF", userId, layout, shadowStyle, borderStyle, buttonStyle, linkBgColor = "#D9D9D9", linkFontColor = "#F5F5F3", font = "DM Sans", phoneFontColor = "#000000", selectedTheme, selectedLiTheme }) => {
  const [links, setLinks] = useState([]);
  const [shopLinks, setShopLinks] = useState([]);
  const [showShopLinks, setShowShopLinks] = useState(false);
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("ava.png");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation
  const [sharedLink, setSharedLink] = useState("");


  // Fetch user details (name)
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("https://linktree-backend-0abv.onrender.com/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setUserName(data.user.username || "User");
        setProfileImage(
          data.user.image && data.user.image.trim() !== ""
            ? data.user.image
            : "https://linktree-backend-0abv.onrender.com/uploads/ava.png"
        );
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch links
  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("https://linktree-backend-0abv.onrender.com/api/user-links", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setLinks(data.links);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };

  // Fetch shop links
  const fetchShopLinks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("https://linktree-backend-0abv.onrender.com/api/user-links-shop", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setShopLinks(data.shopLinks);
      }
    } catch (error) {
      console.error("Error fetching shop links:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchLinks();
    fetchShopLinks();
  }, []);

  const generateShareableLink = () => {
    return `${window.location.origin}/public-profile/${userId}`; // Link to PublicProfileView
  };

  // Handle Share Button Click
  const handleShareClick = async () => {
    const shareableLink = generateShareableLink();
    setSharedLink(shareableLink); // Store the link in state
  
    try {
      await navigator.clipboard.writeText(shareableLink);
      alert("✅ Link copied to clipboard!");
    } catch (error) {
      console.error("❌ Failed to copy link:", error);
      alert("❌ Failed to copy link. Please try again.");
    }
  };
  

  const handleLinkClick = async (linkId, type) => {
    console.log("Sending Click Data:", { linkId, type });
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        return;
      }
  
      // ✅ Fix: Send `linkId` only when it's valid
      const bodyData = linkId && linkId !== "button_click" ? { linkId, type } : { type };
  
      const response = await fetch("https://linktree-backend-0abv.onrender.com/api/increment-clickss", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });
  
      const data = await response.json();
      console.log("Server Response:", data);
  
      if (!data.success) {
        console.error("Error incrementing clicks:", data.message);
        return;
      }
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };
  

  const handleCtaClick = async () => {
    console.log("CTA Click Tracked");
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        return;
      }
  
      const response = await fetch("https://linktree-backend-0abv.onrender.com/api/increment-cta-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log("Server Response:", data);
  
      if (!data.success) {
        console.error("Error incrementing CTA clicks:", data.message);
      }
    } catch (error) {
      console.error("Error tracking CTA click:", error);
    }
  };
  


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`phone-container ${selectedTheme}`} style={{ fontFamily: font, color: phoneFontColor }}>
      {/* Profile Section */}
      <div className={`phone-profile ${selectedTheme}`} style={{ backgroundColor: phoneHeaderColor }}>
        <div className="phone-header">
          <button className="share-btn-ph" onClick={handleShareClick}>
            <img src="shareicon.png" alt="Share" />
          </button>
        </div>
        <img
  src={profileImage}
  alt="User Avatar"
  className="profile-img"
  onError={(e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = "https://linktree-backend-0abv.onrender.com/uploads/ava.png"; // Fallback image
  }}
/>

        <h3 className="phonetitle" style={{ fontFamily: font, color: phoneFontColor }}>
          @{userName}
        </h3>
        <p className="phone-bio" style={{ fontFamily: font, color: phoneFontColor }}>
          {bio}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="phone-buttons">
        <button
          className={`btn-link ${!showShopLinks ? "active" : ""}`}
          onClick={() => {
            setShowShopLinks(false);
            handleLinkClick("button_click", "link")
          }}
        >
          Links
        </button>
        <button
          className={`btn-shop ${showShopLinks ? "active" : ""}`}
          onClick={() => {
            setShowShopLinks(true);
            handleLinkClick("button_click", "shop")
          }}
        >
          Shop
        </button>
      </div>

      {/* Links Section */}
      <ul className={`phone-links ${layout}`}>
        {(showShopLinks ? shopLinks : links).length > 0 ? (
          (showShopLinks ? shopLinks : links).map((link, index) => (
            <li
              className={`link-item ${showShopLinks ? "shop" : ""} ${selectedLiTheme} ${shadowStyle} ${borderStyle} ${buttonStyle} ${selectedTheme}`}
              style={{ backgroundColor: linkBgColor }}
              key={index}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: linkBgColor, color: linkFontColor }}
                onClick={() => handleLinkClick(link._id, showShopLinks ? "shop" : "link")}
              >
                <div className="linksss">
                  <div className="licon">
                    <img src={link.icon} alt={link.title || "Website"} />
                  </div>
                  <span className="link-title" style={{ color: linkFontColor }}>
                    {link.title
                      ? link.title.length > 10
                        ? link.title.slice(0, 10) + "..."
                        : link.title
                      : "Website Link"}
                  </span>
                </div>
              </a>
              {showShopLinks && (
                <button className="shop-now-btn" onClick={() => window.open(link.url, "_blank")}>
                  <div>
                    <img src="shopg.png" alt="Shop Icon" />
                  </div>
                  <div>Buy Now</div>
                </button>
              )}
            </li>
          ))
        ) : (
          <p>Add {showShopLinks ? "shop" : "regular"} links</p>
        )}
      </ul>

      {/* Connect Button */}
      <div className="phone-connect">
        <button className="connect-btn" onClick={handleCtaClick}><a href="https://link-tree-eta-beryl.vercel.app/">Get Connected</a></button>
        <p className="spark-logo">
          <img src="sparklogo.png" alt="Spark" style={{ fontFamily: font, color: phoneFontColor }} /> SPARK
        </p>
      </div>
    </div>
  );
};

export default PhoneView;