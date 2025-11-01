import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  value?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  onChange?: (value: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  }) => void;
  locationText?: string;
  onLocationTextChange?: (value: string) => void;
  readOnly?: boolean;
}

/* 🔹 Component tự center map khi cần */
const RecenterMap: React.FC<{ position: [number, number] }> = ({
  position,
}) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16, { animate: true });
    }
  }, [position]);
  return null;
};

/* 🔹 Component xử lý click trên bản đồ */
const MapEvents: React.FC<{
  onClick: (lat: number, lng: number) => void;
  readOnly?: boolean;
}> = ({ onClick, readOnly }) => {
  useMapEvents({
    click: (e) => {
      if (!readOnly) onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

/* 🔹 Component chính */
export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  locationText,
  onLocationTextChange,
  readOnly = false,
}) => {
  const [position, setPosition] = useState<[number, number] | null>(() => {
    if (value?.coordinates) {
      const [lng, lat] = value.coordinates;
      return [lat, lng]; // convert [lng, lat] -> [lat, lng]
    }
    return [21.0285, 105.8542]; // Default: Hà Nội
  });

  const [locText, setLocText] = useState(locationText || "");
  const [loading, setLoading] = useState(false);
  const [shouldRecenter, setShouldRecenter] = useState(false);

  /* 🔹 Đồng bộ khi prop value thay đổi */
  useEffect(() => {
    if (value?.coordinates) {
      const [lng, lat] = value.coordinates;
      setPosition([lat, lng]);
    }
  }, [value]);

  /* 🔹 Hàm reverse geocode */
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data?.display_name) {
        setLocText(data.display_name);
        onLocationTextChange?.(data.display_name);
      }
    } catch {
      // ignore errors
    }
  };

  /* 🔹 Khi click bản đồ */
  const handleMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setShouldRecenter(false); // click => không recenter
    onChange?.({ type: "Point", coordinates: [lng, lat] });
    reverseGeocode(lat, lng);
  };

  /* 🔹 Khi nhập text */
  const handleLocationTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocText(e.target.value);
    onLocationTextChange?.(e.target.value);
  };

  /* 🔹 Khi nhấn search */
  const handleSearch = async () => {
    if (!locText) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locText
        )}`
      );
      const data = await res.json();
      if (data?.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPosition: [number, number] = [
          parseFloat(lat),
          parseFloat(lon),
        ];
        setPosition(newPosition);
        setShouldRecenter(true); // search => cần recenter
        onChange?.({
          type: "Point",
          coordinates: [parseFloat(lon), parseFloat(lat)],
        });
        if (display_name) {
          setLocText(display_name);
          onLocationTextChange?.(display_name);
        }
      } else {
        message.warning("Không tìm thấy địa điểm phù hợp.");
      }
    } catch (err) {
      message.error("Lỗi khi tìm kiếm địa điểm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Input.Search
        placeholder="Nhập địa chỉ cần tìm"
        enterButton="Tìm kiếm"
        value={locText}
        onChange={handleLocationTextChange}
        onSearch={handleSearch}
        loading={loading}
        disabled={readOnly}
        style={{ marginBottom: 16 }}
      />

      <div className="h-96 w-full overflow-hidden rounded-lg border border-gray-200 relative z-10">
        <MapContainer
          center={position || [21.0285, 105.8542]}
          zoom={16}
          className="h-full w-full z-10"
          style={{ height: "384px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents onClick={handleMapClick} readOnly={readOnly} />
          {position && <Marker position={position} />}
          {shouldRecenter && position && <RecenterMap position={position} />}
        </MapContainer>
      </div>
    </div>
  );
};
