/**
 * @file database.types.ts
 * @directory gaivota.news\lib
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 21/12/2025 13:33
 *
 * @description
 * Descrição objetiva da responsabilidade do arquivo
 *
 * @company Quem é dono do sistema
 * @system Em qual sistema este arquivo existe?
 * @module Qual parte funcional do sistema ele implementa?
 *
 * @maintenance
 * Alterações devem ser registradas conforme normas internas.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          updated_at: string | null;
          role: 'admin' | 'user';
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
          role?: 'admin' | 'user';
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
          role?: 'admin' | 'user';
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          author_id: string;
          published: boolean;
          featured_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          author_id?: string;
          published?: boolean;
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          author_id?: string;
          published?: boolean;
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
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
      };
    };
  };
}
