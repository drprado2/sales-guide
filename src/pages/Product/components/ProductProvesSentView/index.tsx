import React, { useEffect, useState } from 'react';
import './styles.scss';
import { useDispatch } from 'react-redux';
import { GMap } from 'primereact/gmap';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { format } from 'date-fns';
import Tooltip from '@material-ui/core/Tooltip';
import ImageGallery from 'react-image-gallery';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore
const { google } = window;

export interface Seller {
  name: string;
  image: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  title: string;
  date: Date;
  description: string;
  seller: Seller;
  proveImages: string[];
}

interface Props {
  locations: Array<Location>;
}

function calculateCenterPoint(locs: Array<Location>): any {
  if (!locs || !google) {
    return { lat: 0, lng: 0 };
  }
  const bound = new google.maps.LatLngBounds();

  for (let i = 0; i < locs.length; i += 1) {
    bound.extend(new google.maps.LatLng(locs[i].latitude, locs[i].longitude));
  }
  const c = bound.getCenter();
  console.log('new center', c);
  const newCenter = { lat: c.lat(), lng: c.lng() };
  console.log('new center', newCenter);
  return newCenter;
}

const ProductProvesSentView : React.FC<Props> = ({ locations }) => {
  const dispatch = useDispatch();
  const [locs, setLocs] = useState(locations.sort((a, b) => b.date.getTime() - a.date.getTime()));
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [overlays, setOverlays] = useState<Array<any>>([]);
  const [activeProve, setActiveProve] = useState<number | null>(null);
  const [hiddenOnMap, setHiddenOnMap] = useState<Array<number>>([]);
  const [options, setOptions] = useState<any>({
    center: calculateCenterPoint(locations),
    zoom: 13,
  });

  useEffect(() => {
    setOptions({
      center: calculateCenterPoint(locations),
      zoom: 13,
    });
  }, []);

  const onMapReady = (map: any) => {
    setIsMapReady(true);
  };

  useEffect(() => {
    if (!isMapReady || !google) {
      return;
    }
    setLocs(locations.sort((a, b) => b.date.getTime() - a.date.getTime()));
  }, [locations, isMapReady]);

  useEffect(() => {
    if (!isMapReady || !google) {
      return;
    }
    setOverlays(locs.filter((l, i) => !hiddenOnMap.some((h) => h === i)).map((l, i) => new google.maps.Marker(
      {
        draggable: false,
        position: { lat: l.latitude, lng: l.longitude },
        title: l.title,
        opacity: activeProve === i ? 1 : 0.8,
        zIndex: activeProve === i ? 1000 : 1,
        label: {
          text: `${l.title}`, fontFamily: 'Roboto', fontWeight: activeProve === i ? 'bold' : '100', color: activeProve === i ? '#111' : '#222', fontSize: activeProve === i ? '1.2em' : '1.2em',
        },
      },
    )));
  }, [locs, isMapReady, activeProve, hiddenOnMap]);

  const onOverlayClick = (e: {originalEvent: Event, overlay: any, map: any}) => {
    const locsPosition = locs.findIndex((l) => l.title === e.overlay.title);
    setActiveProve(locsPosition);
    setTimeout(() => {
      scrollTo(locsPosition);
    }, 700);
  };

  const scrollTo = (pos: number) => {
    const id = `prove-${pos}`;
    let element: any = document.getElementById(id);
    if (!element) {
      return;
    }
    let currenttop = 0;
    if (element.offsetParent) {
      do {
        currenttop += element.offsetTop;
        // eslint-disable-next-line no-cond-assign
      } while ((element = element.offsetParent));
      window.scrollTo({ left: 0, top: currenttop, behavior: 'smooth' });
    }
  };

  return (
    <div className="seller-proves-sent-view">
      <div>
        <GMap
          className="p-shadow-3"
          onOverlayClick={onOverlayClick}
          onMapReady={onMapReady}
          overlays={overlays}
          options={options}
          style={{ width: '100%', minHeight: '320px' }}
        />
        <Accordion className="accordion-custom" activeIndex={activeProve} onTabChange={(e) => setActiveProve(e.index)}>
          {
            locs.map((l, i) => (
              <AccordionTab
                key={l.title}
                header={(
                  <div id={`prove-${i}`} className="item-header">
                    {hiddenOnMap.some((h) => h === i)
                      ? (
                        <Tooltip title="Mostrar no mapa"><i
                          onClick={(e) => {
                            e.stopPropagation();
                            setHiddenOnMap(hiddenOnMap.filter((h) => h !== i));
                          }}
                          className="pi pi-eye-slash"
                        />
                        </Tooltip>
                      )
                      : (
                        <Tooltip title="Esconder no mapa"><i
                          onClick={(e) => {
                            e.stopPropagation();
                            setHiddenOnMap(hiddenOnMap.concat([i]));
                          }}
                          className="pi pi-eye"
                        />
                        </Tooltip>
                      )}
                    <img src={l.seller.image} alt={l.seller.name} className="seller-picture p-shadow-3" />
                    <span className="item-title"><span className="time"><span className="title">{l.seller.name}</span> - {format(l.date, "dd/MM/yyyy HH:mm'h'")}</span>  - <span className="title">{l.title}</span> </span>
                  </div>
              )}
              >
                <div>
                  <h3>Imagens</h3>
                  <ImageGallery showPlayButton={false} items={l.proveImages.map((img) => ({ original: img, thumbnail: img }))} />
                  <h3>Descrição</h3>
                  <p>{l.description}</p>
                </div>
              </AccordionTab>
            ))
          }
        </Accordion>
      </div>
    </div>
  );
};

export default ProductProvesSentView;
