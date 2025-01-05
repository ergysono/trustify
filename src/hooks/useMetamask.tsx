"use client";
import {
  useState,
  useEffect,
  createContext,
  PropsWithChildren,
  useContext,
  useCallback,
} from "react";
import {
  handleUserInDatabase,
  fetchUserByWalletAddress,
  fetchAllCategories,
  fetchProtocolsAndCategories,
} from "@/app/_actions/queries";
import { usePrivy } from "@privy-io/react-auth";

interface MetaMaskContextData {
  userId: string | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  protocols: Protocol[];
  categories: Category[];
  setSelectedCategory: (category: string) => void;
  selectedCategory: string;
  profilePic: string;
  setProfilePic: (pic: string) => void;
}

const MetaMaskContext = createContext<MetaMaskContextData>(
  {} as MetaMaskContextData
);

export const MetaMaskContextProvider = ({ children }: PropsWithChildren) => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [profilePic, setProfilePic] = useState<string>("");
  const { user } = usePrivy();

  const _updateWallet = useCallback(async () => {
    const walletAddress = user?.wallet?.address;
    if (walletAddress) {
      await handleUserInDatabase(walletAddress);
      const _user = await fetchUserByWalletAddress(walletAddress.toLowerCase());
      setUserId(_user?.id || null);
    }
  }, [user?.wallet?.address]);

  useEffect(() => {
    if (user?.wallet?.address) {
      _updateWallet();
    }
  }, [user?.wallet?.address, _updateWallet]);

  useEffect(() => {
    const getProtocolsAndCategories = async () => {
      try {
        const res = await fetchProtocolsAndCategories();
        const cat = await fetchAllCategories();
        setProtocols(res);
        setCategories(cat);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getProtocolsAndCategories();
  }, []);

  return (
    <MetaMaskContext.Provider
      value={{
        userId,
        loading,
        setLoading,
        protocols,
        categories,
        selectedCategory,
        setSelectedCategory,
        profilePic,
        setProfilePic,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error(
      "useMetaMask must be used within a MetaMaskContextProvider"
    );
  }
  return context;
};
