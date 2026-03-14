import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, 
 
  FiGrid,
  FiLogOut,
  FiMenu,
  FiX,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiEye,
  FiUser,
  FiCalendar,
  FiSave,
  FiUpload,
  FiX as FiClose,
  FiMapPin,
  FiImage,
  FiInbox,
  FiCheckCircle,
  FiMessageCircle,
  FiBriefcase
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { 
  useCreateExperienceMutation, 
  useCreateProjectMutation, 
  useDeleteExperienceMutation, 
  useDeleteMessageMutation, 
  useDeleteProjectMutation, 
  useGetMessagesQuery, 
  useMarkMessageReadMutation, 
  useUpdateExperienceMutation, 
  useUpdateProjectMutation 
} from '../../api/adminApi';
import { useGetProjectsQuery, useGetWorkExperienceQuery } from '../../api/publicApi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('messages');
  const [isEditing, setIsEditing] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Message filter states
  const [messageFilter, setMessageFilter] = useState('all'); // 'all', 'unread', 'read'
  const [searchTerm, setSearchTerm] = useState('');

  // API Hooks
  // Projects
  const [createProject, { isLoading: isCreatingProject }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdatingProject }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation();
  const { data: projectsData, refetch: refetchProjects } = useGetProjectsQuery();
  
  // Work Experience
  const [createExperience, { isLoading: isCreatingExperience }] = useCreateExperienceMutation();
  const [updateExperience, { isLoading: isUpdatingExperience }] = useUpdateExperienceMutation();
  const [deleteExperience, { isLoading: isDeletingExperience }] = useDeleteExperienceMutation();
  const { data: getAllExperience, refetch: refetchExperiences } = useGetWorkExperienceQuery();

  // Messages
  const { data: messagesData, refetch: refetchMessages, isLoading: isLoadingMessages } = useGetMessagesQuery();
  const [markMessageRead, { isLoading: isMarkingRead }] = useMarkMessageReadMutation();
  const [deleteMessage, { isLoading: isDeletingMessage }] = useDeleteMessageMutation();

  // Local state for data
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // Update local state when API data changes
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData?.messages || []);
    }
  }, [messagesData]);

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData?.data || []);
    }
  }, [projectsData]);

  useEffect(() => {
    if (getAllExperience) {
      setExperiences(getAllExperience?.data || []);
    }
  }, [getAllExperience]);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    imageFile: null,
    imagePreview: null,
    github: '',
    live: '',
    featured: false
  });

  const [newExperience, setNewExperience] = useState({
    role: '',
    company: '',
    description: '',
    technologies: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    companyLogo: '',
    location: ''
  });

  const [editingItem, setEditingItem] = useState(null);

  // Handle image upload
  const handleImageUpload = (e, isEditing = false, itemId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEditing && itemId) {
        setEditingItem({
          ...editingItem,
          companyLogo: file,
          companyLogoPreview: reader.result
        });
      } else {
        setNewProject({
          ...newProject,
          imageFile: file,
          imagePreview: reader.result
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (isEditing = false, itemId = null) => {
    if (isEditing && itemId) {
      setEditingItem({
        ...editingItem,
        companyLogo: null,
        companyLogoPreview: null
      });
    } else {
      setNewProject({
        ...newProject,
        imageFile: null,
        imagePreview: null
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  // Handle message actions
  const markAsRead = async (id) => {
    try {
      await markMessageRead(id).unwrap();
      // Update local state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === id ? { ...msg, status: 'read' } : msg
        )
      );
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      alert('Failed to update message status');
    }
  };

  const markAsUnread = async (id) => {
    // This would need a corresponding API endpoint
    // For now, we'll just update locally
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg._id === id ? { ...msg, status: 'unread' } : msg
      )
    );
  };

  const deleteMessageHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(id).unwrap();
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== id));
      } catch (error) {
        console.error('Failed to delete message:', error);
        alert('Failed to delete message');
      }
    }
  };

  // Handle project actions
  const addProject = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newProject.title);
      formData.append('description', newProject.description);
      formData.append('technologies', newProject.technologies);
      formData.append('github', newProject.github);
      formData.append('live', newProject.live);
      formData.append('featured', newProject.featured);
      
      if (newProject.imageFile) {
        formData.append('image', newProject.imageFile);
      }

      await createProject(formData).unwrap();
      refetchProjects();
      
      setShowAddModal(false);
      setNewProject({
        title: "",
        description: "",
        technologies: "",
        imageFile: null,
        imagePreview: null,
        github: "",
        live: "",
        featured: false
      });
      setUploadProgress(0);

    } catch (error) {
      console.error("Failed to create project:", error);
      alert('Failed to create project. Please try again.');
    }
  };

  const updateProjectHandler = async (id) => {
    try {
      const formData = new FormData();
      formData.append('title', editingItem.title);
      formData.append('description', editingItem.description);
      formData.append('technologies', editingItem.techStack);
      formData.append('github', editingItem.githubLink);
      formData.append('live', editingItem.liveLink);
      formData.append('featured', editingItem.featured);
      
      if (editingItem.imageFile) {
        formData.append('image', editingItem.imageFile);
      }

      await updateProject({ id, data: formData }).unwrap();
      refetchProjects();
      
      setIsEditing(null);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project');
    }
  };

  const deleteProjectHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id).unwrap();
        refetchProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project');
      }
    }
  };

  // Handle experience actions
  const addExperience = async () => {
    try {
      const experienceData = {
        role: newExperience.role,
        company: newExperience.company,
        description: newExperience.description,
        technologies: newExperience.technologies.split(',').map(t => t.trim()),
        startDate: new Date(newExperience.startDate),
        endDate: newExperience.endDate ? new Date(newExperience.endDate) : undefined,
        currentlyWorking: newExperience.currentlyWorking,
        companyLogo: newExperience.companyLogo,
        location: newExperience.location
      };

      await createExperience(experienceData).unwrap();
      refetchExperiences();
      
      setShowAddModal(false);
      setNewExperience({
        role: '',
        company: '',
        description: '',
        technologies: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        companyLogo: '',
        location: ''
      });

    } catch (error) {
      console.error("Failed to create experience:", error);
      alert('Failed to create experience. Please try again.');
    }
  };

  const updateExperienceHandler = async (id) => {
    try {
      const experienceData = {
        role: editingItem.role,
        company: editingItem.company,
        description: editingItem.description,
        technologies: editingItem.technologies.split(',').map(t => t.trim()),
        startDate: new Date(editingItem.startDate),
        endDate: editingItem.endDate ? new Date(editingItem.endDate) : undefined,
        currentlyWorking: editingItem.currentlyWorking,
        companyLogo: editingItem.companyLogo,
        location: editingItem.location
      };

      await updateExperience({ id, data: experienceData }).unwrap();
      refetchExperiences();
      
      setIsEditing(null);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update experience:', error);
      alert('Failed to update experience');
    }
  };

  const deleteExperienceHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience(id).unwrap();
        refetchExperiences();
      } catch (error) {
        console.error('Failed to delete experience:', error);
        alert('Failed to delete experience');
      }
    }
  };

  // Filter messages based on search and status
  const getFilteredMessages = () => {
    let filtered = messages || [];
    
    // Apply status filter
    if (messageFilter === 'unread') {
      filtered = filtered.filter(msg => msg.status === 'unread');
    } else if (messageFilter === 'read') {
      filtered = filtered.filter(msg => msg.status === 'read');
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Get counts
  const unreadCount = messages?.filter(m => m.status === 'unread').length || 0;
  const readCount = messages?.filter(m => m.status === 'read').length || 0;
  const totalCount = messages?.length || 0;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric'
    });
  };

  const sidebarVariants = {
    open: { width: 280 },
    closed: { width: 80 }
  };

  // Mobile menu
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: 'var(--color-dark-100)' }}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4" style={{ backgroundColor: 'var(--color-dark-200)' }}>
        <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
          Admin Panel
        </span>
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg hover:bg-[var(--color-dark-300)] transition-colors"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={toggleMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: mobileSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'tween' }}
        className="fixed top-0 left-0 h-full w-64 z-40 md:hidden"
        style={{ backgroundColor: 'var(--color-dark-200)' }}
      >
        <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--color-dark-400)' }}>
          <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
            Admin Panel
          </span>
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-lg hover:bg-[var(--color-dark-300)] transition-colors"
          >
            <FiX />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {[
              { id: 'messages', icon: FiMail, label: 'Messages', count: unreadCount },
              { id: 'projects', icon: FiGrid, label: 'Projects' },
              { id: 'experience', icon: FiBriefcase, label: 'Experience' },
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    toggleMobileSidebar();
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-[var(--color-dark-300)]'
                  }`}
                  style={activeTab === item.id ? { backgroundColor: 'var(--color-accent-primary)' } : {}}
                >
                  <item.icon className="text-xl" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: 'var(--color-dark-400)' }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[var(--color-dark-300)] transition-colors"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Desktop Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={sidebarOpen ? 'open' : 'closed'}
        className="hidden md:flex relative z-20 flex-col"
        style={{ backgroundColor: 'var(--color-dark-200)' }}
      >
        <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--color-dark-400)' }}>
          {sidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent"
            >
              Admin Panel
            </motion.span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[var(--color-dark-300)] transition-colors"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { id: 'messages', icon: FiMail, label: 'Messages' },
              { id: 'projects', icon: FiGrid, label: 'Projects' },
              { id: 'experience', icon: FiBriefcase, label: 'Experience' },
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-[var(--color-dark-300)]'
                  }`}
                  style={activeTab === item.id ? { backgroundColor: 'var(--color-accent-primary)' } : {}}
                >
                  <item.icon className="text-xl" />
                  {sidebarOpen && <span>{item.label}</span>}
                  {sidebarOpen && item.id === 'messages' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'var(--color-dark-400)' }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[var(--color-dark-300)] transition-colors"
          >
            <FiLogOut className="text-xl" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard
              </span>
            </h1>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              {/* Search - show for all tabs */}
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: 'var(--color-dark-300)',
                    borderColor: 'var(--color-dark-400)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                />
                <FiMail className="absolute left-3 top-2.5 text-gray-500" />
              </div>

              {/* Add button - only for projects and experience */}
              {activeTab !== 'messages' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  disabled={isCreatingProject || isCreatingExperience}
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-white disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-accent-primary)' }}
                >
                  <FiPlus />
                  <span>Add New</span>
                </button>
              )}
            </div>
          </div>

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* Message Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-lg cursor-pointer"
                  style={{ 
                    backgroundColor: messageFilter === 'all' ? 'var(--color-accent-primary)' : 'var(--color-dark-200)',
                    transition: 'background-color 0.3s'
                  }}
                  onClick={() => setMessageFilter('all')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Messages</p>
                      <p className="text-3xl font-bold text-white">{totalCount}</p>
                    </div>
                    <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-dark-300)' }}>
                      <FiInbox className="text-2xl" style={{ color: 'var(--color-accent-primary)' }} />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-lg cursor-pointer"
                  style={{ 
                    backgroundColor: messageFilter === 'unread' ? 'var(--color-accent-primary)' : 'var(--color-dark-200)',
                    transition: 'background-color 0.3s'
                  }}
                  onClick={() => setMessageFilter('unread')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Unread</p>
                      <p className="text-3xl font-bold text-white">{unreadCount}</p>
                    </div>
                    <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-dark-300)' }}>
                      <FiMessageCircle className="text-2xl" style={{ color: 'var(--color-accent-primary)' }} />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-lg cursor-pointer"
                  style={{ 
                    backgroundColor: messageFilter === 'read' ? 'var(--color-accent-primary)' : 'var(--color-dark-200)',
                    transition: 'background-color 0.3s'
                  }}
                  onClick={() => setMessageFilter('read')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Read</p>
                      <p className="text-3xl font-bold text-white">{readCount}</p>
                    </div>
                    <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-dark-300)' }}>
                      <FiCheckCircle className="text-2xl" style={{ color: 'var(--color-accent-primary)' }} />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setMessageFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    messageFilter === 'all' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  style={messageFilter === 'all' ? { backgroundColor: 'var(--color-accent-primary)' } : {}}
                >
                  All Messages ({totalCount})
                </button>
                <button
                  onClick={() => setMessageFilter('unread')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    messageFilter === 'unread' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  style={messageFilter === 'unread' ? { backgroundColor: 'var(--color-accent-primary)' } : {}}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setMessageFilter('read')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    messageFilter === 'read' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  style={messageFilter === 'read' ? { backgroundColor: 'var(--color-accent-primary)' } : {}}
                >
                  Read ({readCount})
                </button>
              </div>

              {/* Messages List */}
              {isLoadingMessages ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: 'var(--color-accent-primary)' }}></div>
                  <p className="text-gray-400 mt-4">Loading messages...</p>
                </div>
              ) : getFilteredMessages().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No messages found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredMessages().map(message => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 md:p-6 rounded-lg"
                      style={{ backgroundColor: 'var(--color-dark-200)' }}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex items-start space-x-4">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'var(--color-dark-300)' }}
                          >
                            <FiUser style={{ color: 'var(--color-accent-primary)' }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{message.name}</h3>
                            <p className="text-sm text-gray-400 break-all">{message.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 self-start">
                          {message.status === 'unread' ? (
                            <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'var(--color-accent-primary)', color: 'white' }}>
                              Unread
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'var(--color-dark-300)', color: 'var(--color-accent-secondary)' }}>
                              Read
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 whitespace-pre-wrap">{message.message}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <FiCalendar />
                          <span>{formatDate(message.createdAt || message.date)}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {message.status === 'unread' ? (
                            <button
                              onClick={() => markAsRead(message._id)}
                              disabled={isMarkingRead}
                              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--color-dark-300)] text-gray-400 hover:text-[var(--color-accent-primary)] transition-colors disabled:opacity-50"
                              title="Mark as read"
                            >
                              <FiEye />
                              <span className="text-sm">Mark as read</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => markAsUnread(message._id)}
                              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--color-dark-300)] text-gray-400 hover:text-[var(--color-accent-secondary)] transition-colors"
                              title="Mark as unread"
                            >
                              <FiMessageCircle />
                              <span className="text-sm">Mark as unread</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              window.location.href = `mailto:${message.email}?subject=Re: Your message from portfolio`;
                            }}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--color-dark-300)] text-gray-400 hover:text-[var(--color-accent-secondary)] transition-colors"
                            title="Reply via email"
                          >
                            <FiMail />
                            <span className="text-sm">Reply</span>
                          </button>
                          <button
                            onClick={() => deleteMessageHandler(message._id)}
                            disabled={isDeletingMessage}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--color-dark-300)] text-gray-400 hover:text-[var(--color-accent-error)] transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <FiTrash2 />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Projects Tab - Make responsive */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects?.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">No projects found</p>
                </div>
              ) : (
                projects?.map(project => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-lg overflow-hidden"
                    style={{ backgroundColor: 'var(--color-dark-200)' }}
                  >
                    {/* Project card content (same as before but with responsive adjustments) */}
                    {isEditing === project._id ? (
                      <div className="p-4 space-y-4">
                        {/* Edit form content */}
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Project Image</label>
                          <div className="relative">
                            {editingItem?.imagePreview || project.imageURL ? (
                              <div className="relative">
                                <img 
                                  src={editingItem?.imagePreview || project.imageURL} 
                                  alt="Preview" 
                                  className="w-full h-40 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => removeImage(true, project._id)}
                                  className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                                >
                                  <FiClose size={16} />
                                </button>
                              </div>
                            ) : (
                              <div 
                                className="w-full h-40 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed"
                                style={{ borderColor: 'var(--color-dark-400)' }}
                                onClick={() => document.getElementById(`edit-image-${project._id}`).click()}
                              >
                                <FiUpload className="text-3xl mb-2" style={{ color: 'var(--color-accent-primary)' }} />
                                <p className="text-sm text-gray-400">Click to upload image</p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                              </div>
                            )}
                            <input
                              type="file"
                              id={`edit-image-${project._id}`}
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, true, project._id)}
                            />
                          </div>
                        </div>

                        <input
                          type="text"
                          value={editingItem?.title || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                          placeholder="Project Title"
                          className="w-full px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--color-dark-300)' }}
                        />
                        <textarea
                          value={editingItem?.description || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          placeholder="Description"
                          rows="3"
                          className="w-full px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--color-dark-300)' }}
                        />
                        <input
                          type="text"
                          value={editingItem?.techStack || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, techStack: e.target.value })}
                          placeholder="Technologies (comma separated)"
                          className="w-full px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--color-dark-300)' }}
                        />
                        <input
                          type="text"
                          value={editingItem?.githubLink || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, githubLink: e.target.value })}
                          placeholder="GitHub URL"
                          className="w-full px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--color-dark-300)' }}
                        />
                        <input
                          type="text"
                          value={editingItem?.liveLink || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, liveLink: e.target.value })}
                          placeholder="Live Demo URL"
                          className="w-full px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--color-dark-300)' }}
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="edit-featured"
                            checked={editingItem?.featured || false}
                            onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                          />
                          <label htmlFor="edit-featured" className="text-gray-300">Featured Project</label>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateProjectHandler(project._id)}
                            disabled={isUpdatingProject}
                            className="flex-1 px-4 py-2 rounded-lg text-white disabled:opacity-50"
                            style={{ backgroundColor: 'var(--color-accent-secondary)' }}
                          >
                            <FiSave className="inline mr-2" />
                            {isUpdatingProject ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setIsEditing(null)}
                            className="px-4 py-2 rounded-lg"
                            style={{ backgroundColor: 'var(--color-dark-300)', color: 'var(--color-accent-error)' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={project.imageURL || 'https://via.placeholder.com/300x200'} 
                          alt={project.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-white">{project.title}</h3>
                            {project.featured && (
                              <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'var(--color-accent-primary)', color: 'white' }}>
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.techStack?.slice(0, 3).map((tech, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs rounded-full"
                                style={{ backgroundColor: 'var(--color-dark-300)', color: 'var(--color-accent-primary)' }}
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack?.length > 3 && (
                              <span className="px-2 py-1 text-xs rounded-full text-gray-400">
                                +{project.techStack.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2 text-sm">
                              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                GitHub
                              </a>
                              <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                Live
                              </a>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setIsEditing(project._id);
                                  setEditingItem({ 
                                    ...project, 
                                    techStack: project.techStack?.join(', ') || '',
                                    imagePreview: project.imageURL 
                                  });
                                }}
                                className="p-2 rounded-lg hover:bg-[var(--color-dark-300)] text-gray-400 hover:text-[var(--color-accent-primary)] transition-colors"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                onClick={() => deleteProjectHandler(project._id)}
                                className="p-2 rounded-lg hover:bg-[var(--color-dark-300)] text-gray-400 hover:text-[var(--color-accent-error)] transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Experience Tab - Make responsive */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {experiences?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No experience entries found</p>
                </div>
              ) : (
                experiences?.map(exp => (
                  <motion.div
                    key={exp._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 md:p-6 rounded-lg"
                    style={{ backgroundColor: 'var(--color-dark-200)' }}
                  >
                    {/* Experience card content (same as before with responsive adjustments) */}
                    {isEditing === exp._id ? (
                      <div className="space-y-4">
                        {/* Edit form - same as before but with responsive classes */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                          {editingItem?.companyLogoPreview || exp.companyLogo ? (
                            <div className="relative">
                              <img 
                                src={editingItem?.companyLogoPreview || exp.companyLogo} 
                                alt="Company Logo" 
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <button
                                onClick={() => {
                                  setEditingItem({
                                    ...editingItem,
                                    companyLogo: null,
                                    companyLogoPreview: null
                                  });
                                }}
                                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                              >
                                <FiClose size={12} />
                              </button>
                            </div>
                          ) : (
                            <div 
                              className="w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed"
                              style={{ borderColor: 'var(--color-dark-400)' }}
                              onClick={() => document.getElementById(`edit-logo-${exp._id}`).click()}
                            >
                              <FiImage className="text-2xl" style={{ color: 'var(--color-accent-primary)' }} />
                            </div>
                          )}
                          <input
                            type="file"
                            id={`edit-logo-${exp._id}`}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEditingItem({
                                    ...editingItem,
                                    companyLogo: file,
                                    companyLogoPreview: reader.result
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>

                        <input
                          type="text"
                          value={editingItem?.role || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                          placeholder="Job Role"
                          className="w-full px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--color-dark-300)' }}
                        />
                        <input
                          type="text"
                          value={editingItem?.company || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                          placeholder="Company"
                          className="w-full px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--color-dark-300)' }}
                        />
                        <input
                          type="text"
                          value={editingItem?.location || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                          placeholder="Location"
                          className="w-full px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--color-dark-300)' }}
                        />
                        <textarea
                          value={editingItem?.description || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          placeholder="Description"
                          rows="3"
                          className="w-full px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--color-dark-300)' }}
                        />
                        <input
                          type="text"
                          value={editingItem?.technologies || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, technologies: e.target.value })}
                          placeholder="Technologies (comma separated)"
                          className="w-full px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--color-dark-300)' }}
                        />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={editingItem?.startDate?.split('T')[0] || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg"
                              style={{ backgroundColor: 'var(--color-dark-300)' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">End Date</label>
                            <input
                              type="date"
                              value={editingItem?.endDate?.split('T')[0] || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                              disabled={editingItem?.currentlyWorking}
                              className="w-full px-4 py-2 rounded-lg disabled:opacity-50"
                              style={{ backgroundColor: 'var(--color-dark-300)' }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="edit-currentlyWorking"
                            checked={editingItem?.currentlyWorking || false}
                            onChange={(e) => {
                              setEditingItem({ 
                                ...editingItem, 
                                currentlyWorking: e.target.checked,
                                endDate: e.target.checked ? '' : editingItem?.endDate
                              });
                            }}
                          />
                          <label htmlFor="edit-currentlyWorking" className="text-gray-300">Currently Working</label>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateExperienceHandler(exp._id)}
                            disabled={isUpdatingExperience}
                            className="flex-1 px-4 py-2 rounded-lg text-white disabled:opacity-50"
                            style={{ backgroundColor: 'var(--color-accent-secondary)' }}
                          >
                            <FiSave className="inline mr-2" />
                            {isUpdatingExperience ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setIsEditing(null)}
                            className="px-4 py-2 rounded-lg"
                            style={{ backgroundColor: 'var(--color-dark-300)', color: 'var(--color-accent-error)' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div className="flex items-start space-x-4">
                            {exp.companyLogo ? (
                              <img 
                                src={exp.companyLogo} 
                                alt={exp.company} 
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div 
                                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: 'var(--color-dark-300)' }}
                              >
                                <FiBriefcase style={{ color: 'var(--color-accent-primary)' }} />
                              </div>
                            )}
                            <div>
                              <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                              <p className="text-[var(--color-accent-secondary)]">{exp.company}</p>
                              {exp.location && (
                                <p className="text-sm text-gray-400 flex items-center mt-1">
                                  <FiMapPin className="mr-1" size={12} />
                                  {exp.location}
                                </p>
                              )}
                            </div>
                          </div>
                          {exp.currentlyWorking && (
                            <span className="self-start sm:self-center px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'var(--color-accent-secondary)', color: 'var(--color-dark-100)' }}>
                              Current
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-400 mb-3">
                          {formatDisplayDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDisplayDate(exp.endDate)}
                        </p>

                        <p className="text-gray-300 mb-4 text-sm md:text-base">{exp.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {exp.technologies?.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs rounded-full"
                              style={{ backgroundColor: 'var(--color-dark-300)', color: 'var(--color-accent-primary)' }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setIsEditing(exp._id);
                              setEditingItem({ 
                                ...exp, 
                                technologies: exp.technologies?.join(', ') || '',
                                startDate: exp.startDate?.split('T')[0],
                                endDate: exp.endDate?.split('T')[0]
                              });
                            }}
                            className="p-2 rounded-lg hover:bg-[var(--color-dark-300)] text-gray-400 hover:text-[var(--color-accent-primary)] transition-colors"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => deleteExperienceHandler(exp._id)}
                            className="p-2 rounded-lg hover:bg-[var(--color-dark-300)] text-gray-400 hover:text-[var(--color-accent-error)] transition-colors"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal - Make responsive */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full rounded-lg p-4 md:p-6 max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: 'var(--color-dark-200)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
                Add New {activeTab === 'projects' ? 'Project' : 'Experience'}
              </h2>

              {activeTab === 'projects' ? (
                <div className="space-y-4">
                  {/* Project form content - same as before */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Project Image</label>
                    <div className="relative">
                      {newProject.imagePreview ? (
                        <div className="relative">
                          <img 
                            src={newProject.imagePreview} 
                            alt="Preview" 
                            className="w-full h-40 md:h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                          >
                            <FiClose size={16} />
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-40 md:h-48 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-colors hover:border-[var(--color-accent-primary)]"
                          style={{ borderColor: 'var(--color-dark-400)' }}
                          onClick={() => document.getElementById('project-image').click()}
                        >
                          <FiUpload className="text-3xl md:text-4xl mb-2" style={{ color: 'var(--color-accent-primary)' }} />
                          <p className="text-sm text-gray-400">Click to upload image</p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      )}
                      <input
                        type="file"
                        id="project-image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                    
                    {isUploading && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-1 rounded-full" style={{ backgroundColor: 'var(--color-dark-300)' }}>
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: `${uploadProgress}%`,
                              backgroundColor: 'var(--color-accent-primary)'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-sm md:text-base"
                    style={{ backgroundColor: 'var(--color-dark-300)' }}
                  />
                  <textarea
                    placeholder="Description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg text-sm md:text-base"
                    style={{ backgroundColor: 'var(--color-dark-300)' }}
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma separated)"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-sm md:text-base"
                    style={{ backgroundColor: 'var(--color-dark-300)' }}
                  />
                  <input
                    type="text"
                    placeholder="GitHub URL"
                    value={newProject.github}
                    onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-sm md:text-base"
                    style={{ backgroundColor: 'var(--color-dark-300)' }}
                  />
                  <input
                    type="text"
                    placeholder="Live Demo URL"
                    value={newProject.live}
                    onChange={(e) => setNewProject({ ...newProject, live: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-sm md:text-base"
                    style={{ backgroundColor: 'var(--color-dark-300)' }}
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newProject.featured}
                      onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                    />
                    <label htmlFor="featured" className="text-sm text-gray-300">Featured Project</label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Experience form content - same as before */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Company Logo</label>
                    <div className="relative">
                      {newExperience.companyLogo ? (
                        <div className="relative w-20 h-20 md:w-24 md:h-24">
                          <img 
                            src={newExperience.companyLogo} 
                            alt="Company Logo" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setNewExperience({ ...newExperience, companyLogo: '' })}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                          >
                            <FiClose size={14} />
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="w-20 h-20 md:w-24 md:h-24 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-colors hover:border-[var(--color-accent-primary)]"
                          style={{ borderColor: 'var(--color-dark-400)' }}
                          onClick={() => document.getElementById('company-logo').click()}
                        >
                          <FiImage className="text-2xl md:text-3xl mb-1" style={{ color: 'var(--color-accent-primary)' }} />
                          <p className="text-xs text-gray-400">Upload Logo</p>
                        </div>
                      )}
                      <input
                        type="file"
                        id="company-logo"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewExperience({
                                ...newExperience,
                                companyLogo: reader.result
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Job Role"
                    value={newExperience.role}
                    onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-sm md:text-base"
                    style={{ backgroundColor: 'var(--color-dark-300)' }}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-sm md:text-base"
                    style={{ backgroundColor: 'var(--color-dark-300)' }}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newExperience.location}
                    onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-sm md:text-base"
                    style={{ backgroundColor: 'var(--color-dark-300)' }}
                  />
                  <textarea
                    placeholder="Description"
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg text-sm md:text-base"
                    style={{ backgroundColor: 'var(--color-dark-300)' }}
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma separated)"
                    value={newExperience.technologies}
                    onChange={(e) => setNewExperience({ ...newExperience, technologies: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-sm md:text-base"
                    style={{ backgroundColor: 'var(--color-dark-300)' }}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={newExperience.startDate}
                        onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg text-sm"
                        style={{ backgroundColor: 'var(--color-dark-300)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">End Date</label>
                      <input
                        type="date"
                        value={newExperience.endDate}
                        onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                        disabled={newExperience.currentlyWorking}
                        className="w-full px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                        style={{ backgroundColor: 'var(--color-dark-300)' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="currentlyWorking"
                      checked={newExperience.currentlyWorking}
                      onChange={(e) => {
                        setNewExperience({ 
                          ...newExperience, 
                          currentlyWorking: e.target.checked,
                          endDate: e.target.checked ? '' : newExperience.endDate
                        });
                      }}
                    />
                    <label htmlFor="currentlyWorking" className="text-sm text-gray-300">Currently Working</label>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
                <button
                  onClick={activeTab === 'projects' ? addProject : addExperience}
                  disabled={isUploading || isCreatingProject || isCreatingExperience}
                  className="w-full sm:flex-1 px-4 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--color-accent-primary)' }}
                >
                  {isUploading ? 'Uploading...' : isCreatingProject || isCreatingExperience ? 'Adding...' : 'Add'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewProject({
                      title: '',
                      description: '',
                      technologies: '',
                      imageFile: null,
                      imagePreview: null,
                      github: '',
                      live: '',
                      featured: false
                    });
                    setNewExperience({
                      role: '',
                      company: '',
                      description: '',
                      technologies: '',
                      startDate: '',
                      endDate: '',
                      currentlyWorking: false,
                      companyLogo: '',
                      location: ''
                    });
                    setUploadProgress(0);
                  }}
                  className="w-full sm:flex-1 px-4 py-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-dark-300)', color: 'var(--color-accent-error)' }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;