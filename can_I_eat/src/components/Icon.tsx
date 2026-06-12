/**
 * Thin wrapper around lucide-react-native icons.
 * Maps the prototype's icon names to Lucide equivalents.
 *
 * Usage:  <Icon name="check" size={20} color="#1BB377" stroke={2.5} />
 */
import React from 'react';
import {
  Home, Search, ScanLine, Check, AlertTriangle, Ban,
  ShieldCheck, ChevronLeft, ChevronRight, Share2, Heart,
  Calendar, Info, Users, Clock, Bell, Tag, List, Barcode,
  UtensilsCrossed, MapPin, X, Plus, Settings, LogOut,
  QrCode, UserCircle, Camera, Image, ChevronDown,
  BookmarkCheck, BookmarkPlus, Trash2, Edit3,
  ShoppingBag, Leaf, Sparkles,
} from 'lucide-react-native';
import { Colors } from '../constants/colors';

const MAP = {
  home:         Home,
  search:       Search,
  scan:         ScanLine,
  check:        Check,
  alert:        AlertTriangle,
  ban:          Ban,
  shieldCheck:  ShieldCheck,
  chevronLeft:  ChevronLeft,
  chevronRight: ChevronRight,
  share:        Share2,
  heart:        Heart,
  calendar:     Calendar,
  info:         Info,
  users:        Users,
  clock:        Clock,
  bell:         Bell,
  tag:          Tag,
  list:         List,
  barcode:      Barcode,
  dish:         UtensilsCrossed,
  mapPin:       MapPin,
  x:            X,
  plus:         Plus,
  settings:     Settings,
  logout:       LogOut,
  qr:           QrCode,
  user:         UserCircle,
  camera:       Camera,
  image:        Image,
  chevronDown:  ChevronDown,
  saved:        BookmarkCheck,
  save:         BookmarkPlus,
  trash:        Trash2,
  edit:         Edit3,
  shopping:     ShoppingBag,
  leaf:         Leaf,
  sparkle:      Sparkles,
} as const;

export type IconName = keyof typeof MAP;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
};

export default function Icon({ name, size = 22, color = Colors.text, stroke = 2.2 }: Props) {
  const Component = MAP[name];
  if (!Component) return null;
  return <Component size={size} color={color} strokeWidth={stroke} />;
}
