import { useState, useCallback } from 'react';
import FancyAlert from '../components/ui/FancyAlert';

const useAlert = () => {
  const [alert, setAlert] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    position: 'top',
    duration: 4000
  });

  const showAlert = useCallback(({ 
    type = 'info', 
    title, 
    message, 
    position = 'top', 
    duration = 4000 
  }) => {
    setAlert({
      visible: true,
      type,
      title,
      message,
      position,
      duration
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, visible: false }));
  }, []);

  const AlertComponent = useCallback(() => (
    <FancyAlert
      visible={alert.visible}
      type={alert.type}
      title={alert.title}
      message={alert.message}
      position={alert.position}
      duration={alert.duration}
      onClose={hideAlert}
    />
  ), [alert, hideAlert]);

  return {
    showAlert,
    hideAlert,
    AlertComponent
  };
};

export default useAlert;