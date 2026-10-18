import mascotImg from './images/captain_spectra_mascot_1791879179604.jpg';
import mapBgImg from './images/island_adventure_map_1791879178703.jpg';
import dropletDiagramImg from './images/droplet_dispersion_diagram_1791879180051.jpg';

export const MASCOT_IMAGE_SRC = mascotImg;
export const MAP_BG_IMAGE_SRC = mapBgImg;
export const DROPLET_DIAGRAM_IMAGE_SRC = dropletDiagramImg;

// Public fallback paths if needed
export const FALLBACK_MASCOT = '/assets/images/captain_spectra_mascot_1791879179604.jpg';
export const FALLBACK_MAP = '/assets/images/island_adventure_map_1791879178703.jpg';
export const FALLBACK_DIAGRAM = '/assets/images/droplet_dispersion_diagram_1791879180051.jpg';

/**
 * Safe image error fallback handler to ensure images display seamlessly on Vercel & GitHub
 */
export const onImageErrorWithFallback = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string
) => {
  const target = event.currentTarget;
  if (!target.dataset.hasFallbackRun) {
    target.dataset.hasFallbackRun = 'true';
    target.src = fallback;
  }
};
