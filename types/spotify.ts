export interface SpotifyResponse {
    device: Device;
    repeat_state: string;
    shuffle_state: boolean;
    context: Context;
    timestamp: number;
    progress_ms: number;
    is_playing: boolean;
    item: Item;
    currently_playing_type: string;
    actions: Actions;
  }
  export interface Device {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
    supports_volume: boolean;
  }
  export interface Context {
    type: string;
    href: string;
    external_urls: ExternalUrls;
    uri: string;
  }
  export interface ExternalUrls {
    spotify: string;
  }
  export interface Item {
    album: Album;
    artists?: (ArtistsEntity)[] | null;
    available_markets?: (string)[] | null;
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIds;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: LinkedFrom;
    restrictions: Restrictions;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
  }
  export interface Album {
    album_type: string;
    total_tracks: number;
    available_markets?: (string)[] | null;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images?: (ImagesEntity)[] | null;
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: Restrictions;
    type: string;
    uri: string;
    artists?: (ArtistsEntity1)[] | null;
  }
  export interface ImagesEntity {
    url: string;
    height: number;
    width: number;
  }
  export interface Restrictions {
    reason: string;
  }
  export interface ArtistsEntity1 {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }
  export interface ArtistsEntity {
    external_urls: ExternalUrls;
    followers: Followers;
    genres?: (string)[] | null;
    href: string;
    id: string;
    images?: (ImagesEntity)[] | null;
    name: string;
    popularity: number;
    type: string;
    uri: string;
  }
  export interface Followers {
    href: string;
    total: number;
  }
  export interface ExternalIds {
    isrc: string;
    ean: string;
    upc: string;
  }
  export interface LinkedFrom {
  }
  export interface Actions {
    interrupting_playback: boolean;
    pausing: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
    toggling_repeat_context: boolean;
    toggling_shuffle: boolean;
    toggling_repeat_track: boolean;
    transferring_playback: boolean;
  }