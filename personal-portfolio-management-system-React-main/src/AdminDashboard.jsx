import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/adminDashboard.css';

const emptyData = {
  projects: [],
  skills: [],
  blogs: [],
  certificates: [],
  activity: []
};

const emptyItem = {
  title: '',
  name: '',
  category: 'Web',
  description: '',
  tech: '',
  level: '0%',
  image: '',
  imageName: ''
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);

  const [section, setSection] = useState('Overview');
  const [search, setSearch] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(emptyData);

  const [activeTab, setActiveTab] = useState('Profile');

  const [editProfile, setEditProfile] = useState(false);
  const [profileName, setProfileName] = useState('');

  const [itemModal, setItemModal] = useState(false);
  const [itemType, setItemType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [itemForm, setItemForm] = useState(emptyItem);

  const [certificatePreview, setCertificatePreview] = useState(null);

  // =====================================
  // LOAD ADMIN AND USERS
  // =====================================

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || 'null'
    );

    if (!loggedInUser || loggedInUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    setAdmin(loggedInUser);
    refreshUsers();
  }, [navigate]);

  const refreshUsers = () => {
    try {
      const registeredUsers = JSON.parse(
        localStorage.getItem('users') || '[]'
      );

      setUsers(registeredUsers);
    } catch {
      setUsers([]);
    }
  };

  // =====================================
  // PORTFOLIO DATA
  // =====================================

  const getPortfolio = (email) => {
    if (!email) return { ...emptyData };

    try {
      const saved = JSON.parse(
        localStorage.getItem(
          `portfolio_${email.toLowerCase()}`
        ) || '{}'
      );

      return {
        ...emptyData,
        ...saved
      };
    } catch {
      return { ...emptyData };
    }
  };

  const savePortfolio = (email, updatedData) => {
    localStorage.setItem(
      `portfolio_${email.toLowerCase()}`,
      JSON.stringify(updatedData)
    );

    setUserData(updatedData);
  };

  // =====================================
  // SELECT USER
  // =====================================

  const openUser = (user) => {
    setSelectedUser(user);
    setUserData(getPortfolio(user.email));

    setProfileName(user.name || '');
    setActiveTab('Profile');

    setEditProfile(false);
  };

  const backToUsers = () => {
    setSelectedUser(null);
    setEditProfile(false);
    setItemModal(false);
    setCertificatePreview(null);
    refreshUsers();
  };

  // =====================================
  // UPDATE PROFILE
  // =====================================

  const updateProfile = (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    const updatedUsers = users.map(user =>
      user.email.toLowerCase() ===
      selectedUser.email.toLowerCase()
        ? {
            ...user,
            name: profileName
          }
        : user
    );

    localStorage.setItem(
      'users',
      JSON.stringify(updatedUsers)
    );

    setUsers(updatedUsers);

    const updatedUser = updatedUsers.find(
      user =>
        user.email.toLowerCase() ===
        selectedUser.email.toLowerCase()
    );

    setSelectedUser(updatedUser);

    // Keep session data in sync if this account is active.
    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || 'null'
    );

    if (
      loggedInUser?.email?.toLowerCase() ===
      selectedUser.email.toLowerCase()
    ) {
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({
          ...loggedInUser,
          name: profileName
        })
      );
    }

    setEditProfile(false);
    alert('User profile updated successfully!');
  };

  // =====================================
  // PROFILE PHOTO
  // =====================================

  const changePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file || !selectedUser) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.');
      e.target.value = '';
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      alert('Image must be smaller than 1.5 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = String(reader.result || '');

      const updatedUsers = users.map(user =>
        user.email.toLowerCase() ===
        selectedUser.email.toLowerCase()
          ? { ...user, profileImage: image }
          : user
      );

      localStorage.setItem(
        'users',
        JSON.stringify(updatedUsers)
      );

      setUsers(updatedUsers);

      const updatedUser = updatedUsers.find(
        user =>
          user.email.toLowerCase() ===
          selectedUser.email.toLowerCase()
      );

      setSelectedUser(updatedUser);

      const loggedInUser = JSON.parse(
        localStorage.getItem('loggedInUser') || 'null'
      );

      if (
        loggedInUser?.email?.toLowerCase() ===
        selectedUser.email.toLowerCase()
      ) {
        localStorage.setItem(
          'loggedInUser',
          JSON.stringify({
            ...loggedInUser,
            profileImage: image
          })
        );
      }
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removePhoto = () => {
    if (!selectedUser) return;

    if (!window.confirm('Remove this user profile photo?')) {
      return;
    }

    const updatedUsers = users.map(user =>
      user.email.toLowerCase() ===
      selectedUser.email.toLowerCase()
        ? { ...user, profileImage: '' }
        : user
    );

    localStorage.setItem(
      'users',
      JSON.stringify(updatedUsers)
    );

    setUsers(updatedUsers);

    const updatedUser = updatedUsers.find(
      user =>
        user.email.toLowerCase() ===
        selectedUser.email.toLowerCase()
    );

    setSelectedUser(updatedUser);

    const loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || 'null'
    );

    if (
      loggedInUser?.email?.toLowerCase() ===
      selectedUser.email.toLowerCase()
    ) {
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({
          ...loggedInUser,
          profileImage: ''
        })
      );
    }
  };

  // =====================================
  // ADD / EDIT ITEM
  // =====================================

  const openAddItem = (type) => {
    setItemType(type);
    setEditingId(null);
    setItemForm({ ...emptyItem });
    setItemModal(true);
  };

  const openEditItem = (type, item) => {
    setItemType(type);
    setEditingId(item.id);

    setItemForm({
      ...emptyItem,
      ...item
    });

    setItemModal(true);
  };

  const handleItemImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image.');
      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setItemForm(old => ({
        ...old,
        image: String(reader.result || ''),
        imageName: file.name
      }));
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const saveItem = (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    const type = itemType;

    const isSkill = type === 'skills';
    const isCertificate = type === 'certificates';

    const title = isSkill
      ? itemForm.name
      : itemForm.title;

    if (!title?.trim()) {
      alert('Please enter a title or name.');
      return;
    }

    if (isCertificate && !itemForm.image) {
      alert('Please upload a certificate image.');
      return;
    }

    let updatedItems;

    if (editingId !== null) {
      updatedItems = userData[type].map(item =>
        item.id === editingId
          ? {
              ...item,
              ...itemForm,
              id: item.id
            }
          : item
      );
    } else {
      updatedItems = [
        ...(userData[type] || []),
        {
          ...itemForm,
          id: Date.now()
        }
      ];
    }

    const updatedData = {
      ...userData,
      [type]: updatedItems,
      activity: [
        {
          id: Date.now() + 1,
          message: `Admin ${editingId !== null ? 'updated' : 'added'} ${type}: ${title}`,
          date: new Date().toLocaleString()
        },
        ...(userData.activity || [])
      ].slice(0, 20)
    };

    savePortfolio(selectedUser.email, updatedData);

    setItemModal(false);
    setItemForm({ ...emptyItem });
    setEditingId(null);
  };

  // =====================================
  // DELETE ITEM
  // =====================================

  const deleteItem = (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    const updatedData = {
      ...userData,
      [type]: userData[type].filter(
        item => item.id !== id
      ),
      activity: [
        {
          id: Date.now(),
          message: `Admin deleted an item from ${type}`,
          date: new Date().toLocaleString()
        },
        ...(userData.activity || [])
      ].slice(0, 20)
    };

    savePortfolio(selectedUser.email, updatedData);
  };

  // =====================================
  // DELETE USER
  // =====================================

  const deleteUser = (user) => {
    if (
      user.email.toLowerCase() ===
      admin?.email?.toLowerCase()
    ) {
      alert('You cannot delete your own admin account.');
      return;
    }

    if (!window.confirm(
      `Delete ${user.name || user.email} and all their portfolio data?`
    )) {
      return;
    }

    const updatedUsers = users.filter(
      item =>
        item.email.toLowerCase() !==
        user.email.toLowerCase()
    );

    localStorage.setItem(
      'users',
      JSON.stringify(updatedUsers)
    );

    localStorage.removeItem(
      `portfolio_${user.email.toLowerCase()}`
    );

    setUsers(updatedUsers);

    if (
      selectedUser?.email?.toLowerCase() ===
      user.email.toLowerCase()
    ) {
      setSelectedUser(null);
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  // =====================================
  // COUNTS
  // =====================================

  const normalUsers = users.filter(
    user => user.role !== 'admin'
  );

  const totalItems = (type) =>
    normalUsers.reduce(
      (total, user) =>
        total + getPortfolio(user.email)[type].length,
      0
    );

  const filteredUsers = normalUsers.filter(user =>
    `${user.name || ''} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getInitial = (name) =>
    (name || 'U').charAt(0).toUpperCase();

  if (!admin) return null;

  // =====================================
  // USER DETAIL SCREEN
  // =====================================

  const renderUserDetails = () => {
    if (!selectedUser) return null;

    const tabs = [
      'Profile',
      'Projects',
      'Skills',
      'Blogs',
      'Certificates',
      'Activity'
    ];

    const items =
      activeTab === 'Projects' ? userData.projects :
      activeTab === 'Skills' ? userData.skills :
      activeTab === 'Blogs' ? userData.blogs :
      activeTab === 'Certificates' ? userData.certificates :
      [];

    const typeMap = {
      Projects: 'projects',
      Skills: 'skills',
      Blogs: 'blogs',
      Certificates: 'certificates'
    };

    const currentType = typeMap[activeTab];

    return (
      <div className="admin-detail-page">

        <button
          className="admin-back-btn"
          onClick={backToUsers}
        >
          ← Back to Users
        </button>

        <div className="admin-profile-banner">

          <div className="admin-large-avatar">
            {selectedUser.profileImage ? (
              <img
                src={selectedUser.profileImage}
                alt="User"
              />
            ) : (
              getInitial(selectedUser.name)
            )}
          </div>

          <div className="admin-profile-info">
            <h2>{selectedUser.name || 'Unnamed User'}</h2>
            <p>{selectedUser.email}</p>
            <span className="admin-role">USER ACCOUNT</span>
          </div>

          <button
            className="admin-delete-btn"
            onClick={() => deleteUser(selectedUser)}
          >
            Delete User
          </button>

        </div>

        <div className="admin-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => {
                setActiveTab(tab);
                setEditProfile(false);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PROFILE */}

        {activeTab === 'Profile' && (
          <section className="admin-panel admin-profile-panel">

            <div className="admin-section-heading">
              <div>
                <h2>Personal Information</h2>
                <p>Manage this user's account details.</p>
              </div>

              <button
                className="admin-view-btn"
                onClick={() => {
                  setProfileName(selectedUser.name || '');
                  setEditProfile(!editProfile);
                }}
              >
                {editProfile ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="admin-photo-management">

              <div className="admin-large-avatar">
                {selectedUser.profileImage ? (
                  <img
                    src={selectedUser.profileImage}
                    alt="User profile"
                  />
                ) : (
                  getInitial(selectedUser.name)
                )}
              </div>

              <div>
                <h3>Profile Photo</h3>
                <p>Manage the user's profile picture.</p>

                <label className="admin-upload-btn">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changePhoto}
                    hidden
                  />
                </label>

                {selectedUser.profileImage && (
                  <button
                    className="admin-delete-btn"
                    onClick={removePhoto}
                  >
                    Remove Photo
                  </button>
                )}
              </div>

            </div>

            {editProfile ? (
              <form
                className="admin-edit-form"
                onSubmit={updateProfile}
              >
                <label>Full Name</label>

                <input
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  required
                />

                <label>Email Address</label>

                <input
                  value={selectedUser.email}
                  readOnly
                />

                <button type="submit" className="admin-view-btn">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="admin-info-grid">
                <div>
                  <span>Full Name</span>
                  <strong>{selectedUser.name || 'Not provided'}</strong>
                </div>

                <div>
                  <span>Email Address</span>
                  <strong>{selectedUser.email}</strong>
                </div>

                <div>
                  <span>Account Role</span>
                  <strong>{selectedUser.role || 'user'}</strong>
                </div>

                <div>
                  <span>Total Projects</span>
                  <strong>{userData.projects.length}</strong>
                </div>

                <div>
                  <span>Total Skills</span>
                  <strong>{userData.skills.length}</strong>
                </div>

                <div>
                  <span>Total Certificates</span>
                  <strong>{userData.certificates.length}</strong>
                </div>

                <div>
                  <span>Total Blogs</span>
                  <strong>{userData.blogs.length}</strong>
                </div>
              </div>
            )}

          </section>
        )}

        {/* ITEMS */}

        {currentType && (
          <section className="admin-panel">

            <div className="admin-section-heading">
              <div>
                <h2>{activeTab}</h2>
                <p>
                  Manage {activeTab.toLowerCase()} for {selectedUser.name}.
                </p>
              </div>

              <button
                className="admin-view-btn"
                onClick={() => openAddItem(currentType)}
              >
                + Add {activeTab.slice(0, -1)}
              </button>
            </div>

            {items.length === 0 ? (
              <p className="admin-empty">
                No {activeTab.toLowerCase()} added by this user yet.
              </p>
            ) : (
              <div className="admin-detail-items">

                {items.map((item, index) => (
                  <div className="admin-detail-item" key={item.id || index}>

                    {activeTab === 'Certificates' && item.image && (
                      <img
                        className="admin-certificate-thumb"
                        src={item.image}
                        alt={item.title}
                        onClick={() => setCertificatePreview(item)}
                      />
                    )}

                    <div className="admin-detail-item-content">
                      <h3>
                        {item.title || item.name || `Item ${index + 1}`}
                      </h3>

                      <p>{item.description || 'No description available.'}</p>

                      {activeTab === 'Projects' && (
                        <small>
                          {item.category} · {item.tech}
                        </small>
                      )}

                      {activeTab === 'Skills' && (
                        <small>Level: {item.level}</small>
                      )}

                      {activeTab === 'Blogs' && (
                        <small>{item.category}</small>
                      )}

                      {activeTab === 'Certificates' && (
                        <small>{item.imageName}</small>
                      )}
                    </div>

                    <div className="admin-actions">

                      <button
                        className="admin-view-btn"
                        onClick={() => openEditItem(currentType, item)}
                      >
                        Edit
                      </button>

                      <button
                        className="admin-delete-btn"
                        onClick={() => deleteItem(currentType, item.id)}
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

        {/* ACTIVITY */}

        {activeTab === 'Activity' && (
          <section className="admin-panel">

            <h2>Activity History</h2>

            {userData.activity.length === 0 ? (
              <p className="admin-empty">No activity recorded.</p>
            ) : (
              userData.activity.map((item, index) => (
                <div className="admin-activity-row" key={item.id || index}>
                  <strong>{item.message}</strong>
                  <small>{item.date}</small>
                </div>
              ))
            )}

          </section>
        )}

      </div>
    );
  };

  // =====================================
  // MAIN RETURN
  // =====================================

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <h2>Portfolio Panel</h2>
          <span>ADMINISTRATION</span>
        </div>

        <nav>
          {['Overview', 'Manage Users', 'Activity Logs'].map(item => (
            <button
              key={item}
              className={section === item ? 'active' : ''}
              onClick={() => {
                setSection(item);
                setSelectedUser(null);
                setSearch('');
              }}
            >
              <span>
                {item === 'Overview' ? '▦' :
                  item === 'Manage Users' ? '♙' :
                  item === 'Projects' ? '▣' :
                  item === 'Skills' ? '✦' :
                  item === 'Certificates' ? '▤' :
                  item === 'Blogs' ? '▧' : '◷'}
              </span>
              {item}
            </button>
          ))}
        </nav>

        <button className="admin-logout" onClick={logout}>
          ↪ Logout
        </button>

      </aside>

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <h1>
              {selectedUser ? 'User Details' : section}
            </h1>

            <p>
              Manage and monitor your portfolio platform.
            </p>
          </div>

          <div className="admin-account">

            <div className="admin-avatar">
              {getInitial(admin.name)}
            </div>

            <div>
              <strong>{admin.name}</strong>
              <small>Administrator</small>
            </div>

          </div>

        </header>

        {selectedUser && section === 'Manage Users' ? (
          renderUserDetails()
        ) : (
          <>
            {/* OVERVIEW */}

            {section === 'Overview' && (
              <>
                <div className="admin-welcome">
                  <h2>Welcome back, {admin.name}!</h2>
                  <p>Here is an overview of your portfolio platform.</p>
                </div>

                <div className="admin-stats">

                  {[
                    ['Total Users', normalUsers.length],
                    ['Total Projects', totalItems('projects')],
                    ['Total Skills', totalItems('skills')],
                    ['Certificates', totalItems('certificates')],
                    ['Total Blogs', totalItems('blogs')]
                  ].map(([label, value]) => (
                    <div className="admin-stat" key={label}>
                      <span>{label}</span>
                      <h2>{value}</h2>
                      <small>Platform statistics</small>
                    </div>
                  ))}

                </div>

                <section className="admin-panel">
                  <h2>Recently Registered Users</h2>

                  {normalUsers.slice(-5).reverse().map(user => (
                    <div className="admin-user-row" key={user.email}>
                      <div className="admin-user-summary">
                        <strong>{user.name}</strong>
                        <p>{user.email}</p>
                      </div>

                      <button
                        className="admin-view-btn"
                        onClick={() => {
                          setSection('Manage Users');
                          openUser(user);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  ))}

                  {normalUsers.length === 0 && (
                    <p className="admin-empty">No users registered yet.</p>
                  )}

                </section>
              </>
            )}

            {/* MANAGE USERS */}

            {section === 'Manage Users' && (
              <section className="admin-panel">

                <div className="admin-panel-heading">
                  <div>
                    <h2>Registered Users</h2>
                    <p>Choose a user to manage their complete portfolio.</p>
                  </div>

                  <span>{normalUsers.length} users</span>
                </div>

                <input
                  className="admin-search"
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />

                <div className="admin-users-grid">

                  {filteredUsers.map(user => (
                    <div className="admin-user-card" key={user.email}>

                      <div className="admin-user-card-top">

                        <div className="admin-user-photo">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name}
                            />
                          ) : (
                            getInitial(user.name)
                          )}
                        </div>

                        <div>
                          <h3>{user.name || 'Unnamed User'}</h3>
                          <p>{user.email}</p>
                          <span className="admin-role">USER</span>
                        </div>

                      </div>

                      <button
                        className="admin-user-open"
                        onClick={() => openUser(user)}
                      >
                        Manage User →
                      </button>

                    </div>
                  ))}

                </div>

                {filteredUsers.length === 0 && (
                  <p className="admin-empty">No matching users found.</p>
                )}

              </section>
            )}

            {/* GLOBAL ITEMS */}

            {['Projects', 'Skills', 'Certificates', 'Blogs', 'Activity Logs'].includes(section) && (
              <section className="admin-panel">
                <h2>All User {section}</h2>

                {normalUsers.flatMap(user => {
                  const type =
                    section === 'Activity Logs'
                      ? 'activity'
                      : section.toLowerCase();

                  return getPortfolio(user.email)[type].map((item, index) => (
                    <div className="admin-item" key={`${user.email}-${item.id || index}`}>
                      <h3>{item.title || item.name || item.message || 'Untitled'}</h3>
                      <p>{item.description || item.date || 'No description available.'}</p>
                      <small>Owner: {user.name || user.email}</small>
                    </div>
                  ));
                })}
              </section>
            )}

          </>
        )}

      </main>

      {/* ADD / EDIT MODAL */}

      {itemModal && (
        <div className="admin-modal-backdrop">
          <form className="admin-edit-modal" onSubmit={saveItem}>

            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setItemModal(false)}
            >
              ×
            </button>

            <h2>
              {editingId !== null ? 'Edit' : 'Add'} {itemType.slice(0, -1)}
            </h2>

            {itemType === 'skills' ? (
              <>
                <label>Skill Name</label>

                <input
                  value={itemForm.name}
                  onChange={e => setItemForm({
                    ...itemForm,
                    name: e.target.value
                  })}
                  required
                />

                <label>Description</label>

                <textarea
                  value={itemForm.description}
                  onChange={e => setItemForm({
                    ...itemForm,
                    description: e.target.value
                  })}
                  required
                />

                <label>Skill Level</label>

                <select
                  value={itemForm.level}
                  onChange={e => setItemForm({
                    ...itemForm,
                    level: e.target.value
                  })}
                >
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i}>{i * 10}%</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label>Title</label>

                <input
                  value={itemForm.title}
                  onChange={e => setItemForm({
                    ...itemForm,
                    title: e.target.value
                  })}
                  required
                />

                {itemType !== 'certificates' && (
                  <>
                    <label>Category</label>

                    <input
                      value={itemForm.category}
                      onChange={e => setItemForm({
                        ...itemForm,
                        category: e.target.value
                      })}
                    />
                  </>
                )}

                <label>Description</label>

                <textarea
                  value={itemForm.description}
                  onChange={e => setItemForm({
                    ...itemForm,
                    description: e.target.value
                  })}
                  required
                />

                {itemType === 'projects' && (
                  <>
                    <label>Technologies</label>

                    <input
                      value={itemForm.tech}
                      onChange={e => setItemForm({
                        ...itemForm,
                        tech: e.target.value
                      })}
                    />
                  </>
                )}

                {itemType === 'certificates' && (
                  <>
                    <label>Certificate Image</label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleItemImage}
                    />

                    {itemForm.image && (
                      <img
                        className="admin-modal-image-preview"
                        src={itemForm.image}
                        alt="Certificate preview"
                      />
                    )}
                  </>
                )}
              </>
            )}

            <button className="admin-view-btn" type="submit">
              Save Changes
            </button>

          </form>
        </div>
      )}

      {/* CERTIFICATE PREVIEW */}

      {certificatePreview && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setCertificatePreview(null)}
        >
          <div
            className="admin-certificate-preview-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="admin-modal-close"
              onClick={() => setCertificatePreview(null)}
            >
              ×
            </button>

            <h2>{certificatePreview.title}</h2>

            <img
              src={certificatePreview.image}
              alt={certificatePreview.title}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;