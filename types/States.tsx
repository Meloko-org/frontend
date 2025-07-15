type SocialNetworkState = {
  connected: boolean;
  isEnabled: boolean;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  username?: string;
  pageId?: string; // utile pour Facebook
  pageName?: string; // utile pour Facebook
  expiresAt?: string; // Date sous forme de string ISO
};

type NetworksState = {
  instagram: SocialNetworkState;
  facebook: SocialNetworkState;
  tiktok: SocialNetworkState;
};

export type { SocialNetworkState, NetworksState };
