import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/dashboard.css';

const emptyData = {
  projects: [],
  skills: [],
  blogs: [],
  certificates: [],
  activity: []
};

const getUserData = (email) => {
  const key = `portfolio_${email.toLowerCase()}`;

  try {
    const saved = JSON.parse(localStorage.getItem(key));

    return {
      ...emptyData,
      ...(saved || {})
    };
  } catch {
    return { ...emptyData };
  }
};

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem('loggedInUser') || 'null'
  );

  const isAdmin = user?.role === 'admin';

  const [section, setSection] = useState('Overview');

  const [data, setData] = useState(() =>
    user ? getUserData(user.email) : { ...emptyData }
  );

  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    title: '',
    category: 'Web',
    description: '',
    tech: ''
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    description: '',
    level: '0%'
  });

  const [profileName, setProfileName] = useState(
    user?.name || ''
  );

  const [profileImage, setProfileImage] = useState(
    user?.profileImage || ''
  );

  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const [editing, setEditing] = useState({
    type: '',
    id: null
  });

  const [certificateImage, setCertificateImage] = useState('');
  const [certificateImageName, setCertificateImageName] = useState('');

  const [viewCertificate, setViewCertificate] = useState(null);

  // SAVE PORTFOLIO DATA

  useEffect(() => {
    if (!user?.email) return;

    localStorage.setItem(
      `portfolio_${user.email.toLowerCase()}`,
      JSON.stringify(data)
    );
  }, [data, user?.email]);

  // SAVE USERS

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // LOGIN CHECK

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // ACTIVITY

  const record = (message) => {
    setData(old => ({
      ...old,
      activity: [
        {
          id: Date.now(),
          message,
          date: new Date().toLocaleString()
        },
        ...(old.activity || [])
      ].slice(0, 20)
    }));
  };

  // RESET FORMS

  const resetForm = () => {
    setForm({
      title: '',
      category: 'Web',
      description: '',
      tech: ''
    });

    setSkillForm({
      name: '',
      description: '',
      level: '0%'
    });

    setCertificateImage('');
    setCertificateImageName('');

    const fileInput = document.getElementById(
      'certificate-image-upload'
    );

    if (fileInput) fileInput.value = '';

    setEditing({
      type: '',
      id: null
    });
  };

  // LOGOUT

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  // =====================================
  // PROJECTS
  // =====================================

  const addProject = (e) => {
    e.preventDefault();

    if (editing.type === 'project') {
      setData(old => ({
        ...old,
        projects: old.projects.map(item =>
          item.id === editing.id
            ? { ...item, ...form }
            : item
        )
      }));

      record(`Updated project: ${form.title}`);
    } else {
      setData(old => ({
        ...old,
        projects: [
          ...old.projects,
          {
            id: Date.now(),
            ...form
          }
        ]
      }));

      record(`Added project: ${form.title}`);
    }

    resetForm();
  };

  const editProject = (item) => {
    setForm({
      title: item.title,
      category: item.category,
      description: item.description,
      tech: item.tech
    });

    setEditing({
      type: 'project',
      id: item.id
    });

    setSection('Projects');
  };

  const deleteProject = (id) => {
    if (!window.confirm('Delete this project?')) return;

    setData(old => ({
      ...old,
      projects: old.projects.filter(item => item.id !== id)
    }));

    record('Deleted a project');
  };

  // =====================================
  // SKILLS
  // =====================================

  const addSkill = (e) => {
    e.preventDefault();

    if (editing.type === 'skill') {
      setData(old => ({
        ...old,
        skills: old.skills.map(item =>
          item.id === editing.id
            ? { ...item, ...skillForm }
            : item
        )
      }));

      record(`Updated skill: ${skillForm.name}`);
    } else {
      setData(old => ({
        ...old,
        skills: [
          ...old.skills,
          {
            id: Date.now(),
            ...skillForm
          }
        ]
      }));

      record(`Added skill: ${skillForm.name}`);
    }

    resetForm();
  };

  const editSkill = (item) => {
    setSkillForm({
      name: item.name,
      description: item.description,
      level: item.level
    });

    setEditing({
      type: 'skill',
      id: item.id
    });

    setSection('Skills');
  };

  const deleteSkill = (id) => {
    if (!window.confirm('Delete this skill?')) return;

    setData(old => ({
      ...old,
      skills: old.skills.filter(item => item.id !== id)
    }));

    record('Deleted a skill');
  };

  // =====================================
  // BLOGS
  // =====================================

  const addBlog = (e) => {
    e.preventDefault();

    if (editing.type === 'blog') {
      setData(old => ({
        ...old,
        blogs: old.blogs.map(item =>
          item.id === editing.id
            ? { ...item, ...form }
            : item
        )
      }));

      record(`Updated blog: ${form.title}`);
    } else {
      setData(old => ({
        ...old,
        blogs: [
          ...old.blogs,
          {
            id: Date.now(),
            ...form
          }
        ]
      }));

      record(`Added blog: ${form.title}`);
    }

    resetForm();
  };

  const editBlog = (item) => {
    setForm({
      title: item.title,
      category: item.category,
      description: item.description,
      tech: item.tech || ''
    });

    setEditing({
      type: 'blog',
      id: item.id
    });

    setSection('Blogs');
  };

  const deleteBlog = (id) => {
    if (!window.confirm('Delete this blog?')) return;

    setData(old => ({
      ...old,
      blogs: old.blogs.filter(item => item.id !== id)
    }));

    record('Deleted a blog');
  };

  // =====================================
  // CERTIFICATE IMAGE UPLOAD
  // =====================================

  const handleCertificateImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
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
      setCertificateImage(String(reader.result || ''));
      setCertificateImageName(file.name);
    };

    reader.onerror = () => {
      alert('Unable to read image.');
    };

    reader.readAsDataURL(file);
  };

  // =====================================
  // CERTIFICATES
  // =====================================

  const addCertificate = (e) => {
    e.preventDefault();

    const existing = data.certificates.find(
      item => item.id === editing.id
    );

    const image = certificateImage || existing?.image || '';

    if (!image) {
      alert('Please upload your certificate image.');
      return;
    }

    if (editing.type === 'certificate') {
      setData(old => ({
        ...old,
        certificates: old.certificates.map(item =>
          item.id === editing.id
            ? {
                ...item,
                title: form.title,
                description: form.description,
                image,
                imageName:
                  certificateImageName || item.imageName
              }
            : item
        )
      }));

      record(`Updated certificate: ${form.title}`);
    } else {
      setData(old => ({
        ...old,
        certificates: [
          ...old.certificates,
          {
            id: Date.now(),
            title: form.title,
            description: form.description,
            image,
            imageName: certificateImageName
          }
        ]
      }));

      record(`Added certificate: ${form.title}`);
    }

    resetForm();
  };

  const editCertificate = (item) => {
    setForm({
      title: item.title,
      category: 'Web',
      description: item.description,
      tech: ''
    });

    setCertificateImage(item.image || '');
    setCertificateImageName(item.imageName || '');

    setEditing({
      type: 'certificate',
      id: item.id
    });

    setSection('Certificates');
  };

  const deleteCertificate = (id) => {
    if (!window.confirm('Delete this certificate?')) return;

    setData(old => ({
      ...old,
      certificates: old.certificates.filter(
        item => item.id !== id
      )
    }));

    if (viewCertificate?.id === id) {
      setViewCertificate(null);
    }

    record('Deleted a certificate');
  };

  // =====================================
  // PROFILE IMAGE
  // =====================================

  const openPhotoPicker = () => {
    setShowPhotoMenu(false);

    const input = document.getElementById(
      'profile-image-upload'
    );

    if (input) {
      input.click();
    }
  };

  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.');
      e.target.value = '';
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      alert('Please select an image smaller than 1.5 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImage(String(reader.result || ''));
      setShowPhotoMenu(false);
    };

    reader.onerror = () => {
      alert('Unable to read image.');
    };

    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setProfileImage('');
    setShowPhotoMenu(false);

    const input = document.getElementById(
      'profile-image-upload'
    );

    if (input) input.value = '';
  };

  // SAVE PROFILE

  const saveProfile = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: profileName,
      profileImage
    };

    localStorage.setItem(
      'loggedInUser',
      JSON.stringify(updatedUser)
    );

    const updatedUsers = users.map(item =>
      item.email?.toLowerCase() === user.email?.toLowerCase()
        ? updatedUser
        : item
    );

    setUsers(updatedUsers);

    record('Updated profile');

    alert('Profile updated successfully!');
  };

  // =====================================
  // ADMIN
  // =====================================

  const deleteUser = (email) => {
    if (email === user.email) {
      alert('You cannot delete your own account.');
      return;
    }

    if (!window.confirm('Delete this user account?')) return;

    setUsers(old =>
      old.filter(item => item.email !== email)
    );

    record(`Removed user: ${email}`);
  };

  // NAVIGATION

  const navItems = [
    'Overview',
    'Projects',
    'Skills',
    'Certificates',
    'Blogs',
    'My Profile',
    'Activity'
  ];

  if (isAdmin) {
    navItems.push('Manage Users');
  }

  // ACTION BUTTONS

  const actionButtons = (onEdit, onDelete) => (
    <div className="action-buttons">

      <button
        type="button"
        className="edit-btn"
        onClick={onEdit}
      >
        Edit
      </button>

      <button
        type="button"
        className="danger-btn"
        onClick={onDelete}
      >
        Delete
      </button>

    </div>
  );

  // =====================================
  // MAIN JSX
  // =====================================

  return (
    <div className="dash">

      {/* SIDEBAR */}

      <aside>

        <h2>Portfolio Panel</h2>

        <p>PERSONAL MANAGEMENT</p>

        <nav>
          {navItems.map(item => (
            <button
              key={item}
              className={section === item ? 'active' : ''}
              onClick={() => {
                resetForm();
                setSection(item);
                setShowPhotoMenu(false);
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <button
          className="dashboard-logout"
          onClick={logout}
        >
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <main className="dashmain">

        {/* HEADER */}

        <header className="dashhead">

          <div className="dashhead-user">

            <div className="header-profile-image">

              {profileImage ? (
                <img src={profileImage} alt="Profile" />
              ) : (
                <span>
                  {(profileName || user.name || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}

            </div>

            <div>
              <h1>
                Welcome, {profileName || user.name || 'User'}!
              </h1>

              <p>
                {isAdmin
                  ? 'Administrator Dashboard'
                  : 'Your personal portfolio dashboard'}
              </p>
            </div>

          </div>

          <span>{isAdmin ? 'ADMIN' : 'USER'}</span>

        </header>

        {/* =====================================
            OVERVIEW
        ===================================== */}

        {section === 'Overview' && (
          <>

            <section className="statgrid">

              {[
                ['Total Projects', data.projects.length],
                ['Total Skills', data.skills.length],
                ['Certificates', data.certificates.length],
                ['Blog Articles', data.blogs.length],
                ...(isAdmin
                  ? [['Total Users', users.length]]
                  : [])
              ].map(([label, value]) => (

                <div className="panel" key={label}>
                  <h3>{label}</h3>
                  <h2>{value}</h2>
                </div>

              ))}

            </section>

            <section className="panel overview-welcome">

              <div className="overview-welcome-content">

                <div>
                  <span className="overview-label">
                    PERSONAL WORKSPACE
                  </span>

                  <h2>
                    Welcome to your dashboard
                  </h2>

                  <p>
                    Manage your projects, skills, certificates
                    and blogs from one place.
                  </p>
                </div>

                <div className="overview-avatar">

                  {profileImage ? (
                    <img src={profileImage} alt="Profile" />
                  ) : (
                    <span>
                      {(profileName || user.name || 'U')
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}

                </div>

              </div>

            </section>

            <section className="panel">

              <h2>Recent Activity</h2>

              {data.activity.slice(0, 5).map(item => (
                <div className="item" key={item.id}>
                  <div>
                    <p>{item.message}</p>
                    <small>{item.date}</small>
                  </div>
                </div>
              ))}

              {!data.activity.length && (
                <p>No recent activity yet.</p>
              )}

            </section>

          </>
        )}

        {/* =====================================
            PROJECTS
        ===================================== */}

        {section === 'Projects' && (
          <section className="panel manage">

            <h2>Manage Projects</h2>

            <form
              className="dashboard-form"
              onSubmit={addProject}
            >

              <input
                placeholder="Project title"
                value={form.title}
                onChange={e =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />

              <select
                value={form.category}
                onChange={e =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option>Web</option>
                <option>JavaScript</option>
                <option>React</option>
                <option>Other</option>
              </select>

              <input
                placeholder="Description"
                value={form.description}
                onChange={e =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />

              <input
                placeholder="Technologies"
                value={form.tech}
                onChange={e =>
                  setForm({ ...form, tech: e.target.value })
                }
                required
              />

              <button type="submit">
                {editing.type === 'project'
                  ? 'Update Project'
                  : 'Add Project'}
              </button>

              {editing.type === 'project' && (
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}

            </form>

            {data.projects.map(item => (

              <div className="item" key={item.id}>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  <small>
                    {item.category} · {item.tech}
                  </small>
                </div>

                {actionButtons(
                  () => editProject(item),
                  () => deleteProject(item.id)
                )}

              </div>

            ))}

            {!data.projects.length && (
              <p>No projects added yet.</p>
            )}

          </section>
        )}

        {/* =====================================
            SKILLS
        ===================================== */}

        {section === 'Skills' && (
          <section className="panel manage">

            <h2>Manage Skills</h2>

            <form
              className="dashboard-form"
              onSubmit={addSkill}
            >

              <input
                placeholder="Skill name"
                value={skillForm.name}
                onChange={e =>
                  setSkillForm({
                    ...skillForm,
                    name: e.target.value
                  })
                }
                required
              />

              <input
                placeholder="Description"
                value={skillForm.description}
                onChange={e =>
                  setSkillForm({
                    ...skillForm,
                    description: e.target.value
                  })
                }
                required
              />

              <select
                value={skillForm.level}
                onChange={e =>
                  setSkillForm({
                    ...skillForm,
                    level: e.target.value
                  })
                }
              >
                <option>0%</option>
                <option>10%</option>
                <option>20%</option>
                <option>30%</option>
                <option>40%</option>
                <option>50%</option>
                <option>60%</option>
                <option>70%</option>
                <option>80%</option>
                <option>90%</option>
                <option>100%</option>
              </select>

              <button type="submit">
                {editing.type === 'skill'
                  ? 'Update Skill'
                  : 'Add Skill'}
              </button>

              {editing.type === 'skill' && (
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}

            </form>

            {data.skills.map(item => (

              <div className="item" key={item.id}>

                <div>
                  <h3>
                    {item.name} — {item.level}
                  </h3>

                  <p>{item.description}</p>
                </div>

                {actionButtons(
                  () => editSkill(item),
                  () => deleteSkill(item.id)
                )}

              </div>

            ))}

            {!data.skills.length && (
              <p>No skills added yet.</p>
            )}

          </section>
        )}

        {/* =====================================
            CERTIFICATES
        ===================================== */}

        {section === 'Certificates' && (
          <section className="panel manage certificate-section">

            <h2>Manage Certificates</h2>

            <form
              className="dashboard-form certificate-form"
              onSubmit={addCertificate}
            >

              <input
                placeholder="Certificate title"
                value={form.title}
                onChange={e =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />

              <div className="certificate-upload">

                <label htmlFor="certificate-image-upload">
                  Upload Certificate Image
                </label>

                <input
                  id="certificate-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCertificateImage}
                  required={editing.type !== 'certificate'}
                />

              </div>

              {certificateImage && (
                <div className="certificate-preview">

                  <img
                    src={certificateImage}
                    alt="Certificate Preview"
                  />

                  <p>{certificateImageName}</p>

                </div>
              )}

              <input
                placeholder="Description"
                value={form.description}
                onChange={e =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />

              <div className="certificate-form-buttons">

                <button type="submit">
                  {editing.type === 'certificate'
                    ? 'Update Certificate'
                    : 'Add Certificate'}
                </button>

                {editing.type === 'certificate' && (
                  <button type="button" onClick={resetForm}>
                    Cancel
                  </button>
                )}

              </div>

            </form>

            <div className="certificate-list">

              {data.certificates.map(item => (

                <div className="certificate-card" key={item.id}>

                  <div className="certificate-image-box">

                    <img
                      src={item.image}
                      alt={item.title}
                    />

                  </div>

                  <div className="certificate-details">

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>

                    <button
                      type="button"
                      className="view-certificate-btn"
                      onClick={() => setViewCertificate(item)}
                    >
                      View Certificate
                    </button>

                  </div>

                  <div className="certificate-actions">

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => editCertificate(item)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="danger-btn"
                      onClick={() => deleteCertificate(item.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

              {!data.certificates.length && (
                <p className="empty-certificates">
                  No certificates added yet.
                </p>
              )}

            </div>

          </section>
        )}

        {/* =====================================
            BLOGS
        ===================================== */}

        {section === 'Blogs' && (
          <section className="panel manage">

            <h2>Manage Blogs</h2>

            <form
              className="dashboard-form"
              onSubmit={addBlog}
            >

              <input
                placeholder="Blog title"
                value={form.title}
                onChange={e =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />

              <input
                placeholder="Category"
                value={form.category}
                onChange={e =>
                  setForm({ ...form, category: e.target.value })
                }
                required
              />

              <input
                placeholder="Description"
                value={form.description}
                onChange={e =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />

              <button type="submit">
                {editing.type === 'blog'
                  ? 'Update Blog'
                  : 'Add Blog'}
              </button>

              {editing.type === 'blog' && (
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}

            </form>

            {data.blogs.map(item => (

              <div className="item" key={item.id}>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <small>{item.category}</small>
                </div>

                {actionButtons(
                  () => editBlog(item),
                  () => deleteBlog(item.id)
                )}

              </div>

            ))}

            {!data.blogs.length && (
              <p>No blogs added yet.</p>
            )}

          </section>
        )}

        {/* =====================================
            MY PROFILE
        ===================================== */}

        {section === 'My Profile' && (
          <section className="panel profile">

            <h2>My Profile</h2>

            <form
              className="dashboard-form"
              onSubmit={saveProfile}
            >

              <div className="profile-image-section">

                <div className="profile-photo-wrapper">

                  <button
                    type="button"
                    className="profile-image-preview"
                    onClick={() =>
                      setShowPhotoMenu(old => !old)
                    }
                    aria-label="Manage profile photo"
                    aria-expanded={showPhotoMenu}
                  >

                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile Preview"
                      />
                    ) : (
                      <span>
                        {(profileName || user.name || 'U')
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}

                  </button>

                  {showPhotoMenu && (
                    <div className="profile-photo-menu">

                      {!profileImage ? (
                        <button
                          type="button"
                          onClick={openPhotoPicker}
                        >
                          Add Photo
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={openPhotoPicker}
                          >
                            Change Photo
                          </button>

                          <button
                            type="button"
                            className="remove-photo-option"
                            onClick={removeProfileImage}
                          >
                            Remove Photo
                          </button>
                        </>
                      )}

                    </div>
                  )}

                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImage}
                    style={{ display: 'none' }}
                  />

                </div>

                <div className="profile-image-controls">

                  <h3>Profile Photo</h3>

                  <p>
                    Click your profile photo to add, change
                    or remove it.
                  </p>

                </div>

              </div>

              <label>
                Full Name

                <input
                  value={profileName}
                  onChange={e =>
                    setProfileName(e.target.value)
                  }
                  required
                />
              </label>

              <label>
                Email

                <input value={user.email} readOnly />
              </label>

              <label>
                Account Role

                <input value={user.role || 'user'} readOnly />
              </label>

              <button type="submit">
                Save Profile
              </button>

            </form>

          </section>
        )}

        {/* =====================================
            ACTIVITY
        ===================================== */}

        {section === 'Activity' && (
          <section className="panel">

            <h2>Recent Activity</h2>

            {data.activity.map(item => (

              <div className="item" key={item.id}>

                <div>
                  <p>{item.message}</p>
                  <small>{item.date}</small>
                </div>

              </div>

            ))}

            {!data.activity.length && (
              <p>No activity recorded yet.</p>
            )}

          </section>
        )}

        {/* =====================================
            ADMIN USERS
        ===================================== */}

        {section === 'Manage Users' && isAdmin && (
          <section className="panel manage">

            <h2>User Management</h2>

            {users.map(item => (

              <div className="item" key={item.email}>

                <div>
                  <h3>{item.name || 'Unnamed User'}</h3>
                  <p>{item.email}</p>

                  <small>
                    Role: {item.role || 'user'}
                  </small>
                </div>

                <button
                  className="danger-btn"
                  type="button"
                  onClick={() => deleteUser(item.email)}
                >
                  Delete
                </button>

              </div>

            ))}

            {!users.length && (
              <p>No registered users found.</p>
            )}

          </section>
        )}

      </main>

      {/* CERTIFICATE FULL IMAGE POPUP */}

      {viewCertificate && (
        <div
          className="certificate-modal"
          onClick={() => setViewCertificate(null)}
        >

          <div
            className="certificate-modal-content"
            onClick={e => e.stopPropagation()}
          >

            <button
              type="button"
              className="certificate-modal-close"
              onClick={() => setViewCertificate(null)}
            >
              ×
            </button>

            <h2>{viewCertificate.title}</h2>

            <img
              src={viewCertificate.image}
              alt={viewCertificate.title}
            />

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;