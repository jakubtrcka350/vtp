export interface Work {
  id: string;
  title: string;
  description: string;
  /** Service category tag shown in the modal label */
  tag?: string;
  /** All uploaded image URLs (at least 1) */
  images: string[];
  /** URL of the chosen thumbnail — must be present in `images` */
  coverImage: string;
  createdAt: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: number;
}
