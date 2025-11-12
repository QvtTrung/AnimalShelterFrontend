import React, { useState, useEffect, useMemo } from "react";
import { Card, Typography, Space, Tag, Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/leaflet/marker-icon-2x.png",
  iconUrl: "/images/leaflet/marker-icon.png",
  shadowUrl: "/images/leaflet/marker-shadow.png",
});

const { Title, Text } = Typography;

// Helper – parse the stringified GeoJSON that the backend returns
const parseCoordinates = (
  raw:
    | string
    | { type: "Point"; coordinates: [number, number] }
    | null
    | undefined
): [number, number] | null => {
  if (!raw) return null;

  // already a proper object
  if (
    typeof raw === "object" &&
    raw.type === "Point" &&
    Array.isArray(raw.coordinates)
  ) {
    const [lng, lat] = raw.coordinates;
    return [lat, lng]; // Leaflet: [lat, lng]
  }

  // stringified JSON
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      console.log("Parsed coordinates:", parsed);
      if (parsed?.type === "Point" && Array.isArray(parsed.coordinates)) {
        const [lng, lat] = parsed.coordinates;
        console.log("Original GeoJSON [lng, lat]:", [lng, lat]);
        console.log("Leaflet format [lat, lng]:", [lat, lng]);
        return [lat, lng];
      }
    } catch {
      // ignore malformed JSON
    }
  }

  return null;
};

interface RescueMapProps {
  reportIds: string[];
  reportData: any[];
  show: (resource: string, id: string) => void;
}

// Component to handle map center changes
const MapController = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();

  useEffect(() => {
    if (map && center) {
      console.log(
        "MapController: Setting view to center:",
        center,
        "zoom:",
        zoom
      );
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);

  return null;
};

export const RescueMap: React.FC<RescueMapProps> = ({
  reportIds,
  reportData,
  show,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    21.0285, 105.8542,
  ]); // Hanoi
  const [mapZoom, setMapZoom] = useState(13);

  // Debug logging
  console.log("RescueMap props - reportIds:", reportIds);
  console.log("RescueMap props - reportData:", reportData);

  // Normalise reports (id + coordinates)
  const normalizedReportData = useMemo(() => {
    const normalized =
      reportData?.map((r: any) => ({
        ...r,
        id: r.id ?? r._id,
        parsedCoords: parseCoordinates(r.coordinates),
      })) ?? [];

    console.log("Normalized report data:", normalized);

    return normalized;
  }, [reportData]);

  // Map centre calculation
  useEffect(() => {
    // First filter by reportIds, then check for valid coordinates
    const connectedReports = normalizedReportData.filter((r) =>
      reportIds.includes(r.id)
    );
    const valid = connectedReports.filter((r) => r.parsedCoords);

    console.log("All normalized reports:", normalizedReportData);
    console.log("Connected reports (by IDs):", connectedReports);

    if (valid.length === 0) {
      setMapCenter([21.0285, 105.8542]);
      setMapZoom(13);
      return;
    }

    const sum = valid.reduce(
      (acc, r) => {
        const [lat, lng] = r.parsedCoords!;
        acc.lat += lat;
        acc.lng += lng;
        return acc;
      },
      { lat: 0, lng: 0 }
    );

    // Calculate average coordinates
    const avgLat = sum.lat / valid.length;
    const avgLng = sum.lng / valid.length;

    console.log("Valid reports count:", valid.length);
    console.log("Valid reports:", valid);
    console.log("Coordinates sum:", sum);
    console.log("Average coordinates - lat:", avgLat, "lng:", avgLng);
    console.log("Final center array:", [avgLat, avgLng]);

    const newCenter: [number, number] = [avgLat, avgLng];
    console.log("Setting map center to:", newCenter);
    setMapCenter(newCenter);
    const newZoom = valid.length === 1 ? 15 : 10;
    console.log("Setting map zoom to:", newZoom);
    setMapZoom(newZoom);
  }, [normalizedReportData]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "assigned":
        return "blue";
      case "resolved":
        return "green";
      default:
        return "default";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "yellow";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <Card
      title={
        <Space>
          <EnvironmentOutlined className="text-green-500 text-xl" />
          <Title level={4} className="!m-0">
            Rescue Locations
          </Title>
          <Tag color="green" className="text-base">
            {reportIds.length}{" "}
            {reportIds.length === 1 ? "Location" : "Locations"}
          </Tag>
        </Space>
      }
      variant="outlined"
      className="h-[550px] rounded-2xl shadow-xl border-2 border-green-100 bg-white"
      headStyle={{
        background: "#f8f9fa",
        color: "#333",
        borderBottom: "2px solid #e0e0e0",
      }}
    >
      <div
        style={{ height: "450px" }}
        className="w-full h-full overflow-hidden"
      >
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="h-full w-full"
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {normalizedReportData
            .filter((report) => {
              // Only show reports that are connected to this rescue
              return reportIds.includes(report.id);
            })
            .map((report) => {
              if (!report.parsedCoords) return null;
              const [lat, lng] = report.parsedCoords;
              return (
                <Marker key={report.id} position={[lat, lng]}>
                  <Popup>
                    <div>
                      <Title level={5}>{report.title}</Title>
                      <Space direction="vertical" size="small">
                        <Text>
                          <strong>Status:</strong>{" "}
                          <Tag color={getStatusColor(report.status ?? "")}>
                            {report.status}
                          </Tag>
                        </Text>
                        <Text>
                          <strong>Urgency:</strong>{" "}
                          <Tag
                            color={getUrgencyColor(report.urgency_level ?? "")}
                          >
                            {report.urgency_level}
                          </Tag>
                        </Text>
                        <Text>
                          <strong>Location:</strong> {report.location}
                        </Text>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => show("reports", report.id)}
                        >
                          View Details
                        </Button>
                      </Space>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </Card>
  );
};
