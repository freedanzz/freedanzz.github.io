import React, { useEffect, useState } from 'react';

const DownloadButton = () => {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleBeforeInstallPrompt = (event) => {
    event.preventDefault();
    setCanInstall(true);
  };

  const handleInstall = async () => {
    const promptEvent = new Promise((resolve) => {
      window.addEventListener('appinstalled', resolve);
    });

    const deferredPrompt = window.deferredPrompt;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      await promptEvent;
      setCanInstall(false);
    }
  };

  return (
    <button onClick={handleInstall} disabled={!canInstall}>
      Descargar PWA
    </button>
  );
};

export default DownloadButton;