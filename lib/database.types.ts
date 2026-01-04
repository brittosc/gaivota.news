/**
 * @file database.types.ts
 * @directory gaivota.news\lib
 * @author Gaivota News - gaivota.news
 * @version 0.0.1
 * @since 21/12/2025 13:33
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          updated_at: string | null;
          role: 'admin' | 'user' | 'editor' | 'supporter';
          last_active_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
          role?: 'admin' | 'user' | 'editor' | 'supporter';
          last_active_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
          role?: 'admin' | 'user' | 'editor' | 'supporter';
          last_active_at?: string | null;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          created_at: string;
          file_url?: string | null;
          file_type?: string | null;
          file_name?: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          created_at?: string;
          file_url?: string | null;
          file_type?: string | null;
          file_name?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          file_url?: string | null;
          file_type?: string | null;
          file_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_messages_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      chat_read_receipts: {
        Row: {
          message_id: string;
          user_id: string;
          read_at: string;
        };
        Insert: {
          message_id: string;
          user_id: string;
          read_at?: string;
        };
        Update: {
          message_id?: string;
          user_id?: string;
          read_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_read_receipts_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'chat_messages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chat_read_receipts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          author_id: string;
          published: boolean;
          archived: boolean;
          likes_count: number;
          featured_image: string | null;
          created_at: string;
          updated_at: string;
          newsletter_sent_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          author_id?: string;
          published?: boolean;
          archived?: boolean;
          likes_count?: number;
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
          newsletter_sent_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          author_id?: string;
          published?: boolean;
          archived?: boolean;
          likes_count?: number;
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
          newsletter_sent_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'posts_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_tags_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          active?: boolean;
        };
        Relationships: [];
      };
      supporters: {
        Row: {
          id: string;
          name: string;
          avatar_url: string | null;
          link: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          avatar_url?: string | null;
          link?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar_url?: string | null;
          link?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_likes_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_likes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      post_revisions: {
        Row: {
          id: string;
          post_id: string;
          author_id: string | null;
          title: string;
          content: string;
          status: 'pending' | 'approved' | 'rejected';
          featured_image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id?: string | null;
          title: string;
          content: string;
          status?: 'pending' | 'approved' | 'rejected';
          featured_image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string | null;
          title?: string;
          content?: string;
          status?: 'pending' | 'approved' | 'rejected';
          featured_image?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_revisions_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_revisions_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
        ];
      };

      site_settings: {
        Row: {
          key: string;
          value: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
