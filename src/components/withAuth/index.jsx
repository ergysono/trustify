"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMetaMask } from "@/hooks/useMetamask";
import Notification from "../notification";
import { usePrivy } from '@privy-io/react-auth';

const withAuth = (WrappedComponent) => {
  const WithAuthComponent = (props) => {
    const router = useRouter();
    const [showNotification, setShowNotification] = useState(false);
    const { ready, authenticated } = usePrivy();

    useEffect(() => {
      if (!authenticated) {
        setShowNotification(true);
        const timer = setTimeout(() => {
          router.push("/");
        }, 800);

        return () => clearTimeout(timer);
      }
    }, [authenticated, router]);

    return (
      <>
        <Notification
          message="Please connect your wallet."
          show={showNotification}
          onClose={() => setShowNotification(false)}
          isSuccess={false}
        />
        {authenticated && <WrappedComponent {...props} />}
      </>
    );
  };

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;
