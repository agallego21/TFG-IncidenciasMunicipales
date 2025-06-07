import L from 'leaflet';

export const createSvgIcon = (color) => {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path fill="${color}" stroke="black" stroke-width="1"
        d="M12.5 0C7 0 2.5 4.5 2.5 10c0 7.5 10 29 10 29s10-21.5 10-29c0-5.5-4.5-10-10-10z"/>
      <circle fill="white" cx="12.5" cy="10" r="4"/>
    </svg>
  `;

  return L.divIcon({
    className: '',
    html: svgIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};