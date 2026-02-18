import { createContext, useState, useContext } from 'react';

const CollectionsContext = createContext();

export const CollectionsProvider = ({ children }) => {
  const [isFullscreenCollections, setIsFullscreenCollections] = useState(false);

  return (
    <CollectionsContext.Provider value={{ isFullscreenCollections, setIsFullscreenCollections }}>
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollectionsContext = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('useCollectionsContext must be used within CollectionsProvider');
  }
  return context;
};
