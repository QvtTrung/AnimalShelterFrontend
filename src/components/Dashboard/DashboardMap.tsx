import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Card, Typography, Tag, Button, Radio, Space } from "antd";
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
      if (parsed?.type === "Point" && Array.isArray(parsed.coordinates)) {
        const [lng, lat] = parsed.coordinates;
        return [lat, lng];
      }
    } catch {
      // ignore malformed JSON
    }
  }

  return null;
};

interface DashboardMapProps {
  pendingReports: any[];
  inProgressRescues: any[];
  onShowReport?: (id: string) => void;
  onShowRescue?: (id: string) => void;
}

export interface DashboardMapHandle {
  flyToReport: (reportId: string) => void;
  flyToRescue: (rescueId: string) => void;
}

// Component to handle map center changes and expose map instance
const MapController = ({
  center,
  zoom,
  mapRef,
}: {
  center: [number, number];
  zoom: number;
  mapRef: React.MutableRefObject<L.Map | null>;
}) => {
  const map = useMap();

  useEffect(() => {
    if (map && center) {
      map.setView(center, zoom);
      mapRef.current = map;
    }
  }, [map, center, zoom, mapRef]);

  return null;
};

// Create custom icons for different types
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${color};
      width: 25px;
      height: 25px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
  });
};

export const DashboardMap = forwardRef<DashboardMapHandle, DashboardMapProps>(
  ({ pendingReports, inProgressRescues, onShowReport, onShowRescue }, ref) => {
    const [displayMode, setDisplayMode] = useState<"reports" | "rescues">(
      "reports"
    );
    const [mapCenter, setMapCenter] = useState<[number, number]>([
      21.0285, 105.8542,
    ]); // Hanoi
    const [mapZoom, setMapZoom] = useState(13);
    const mapRef = useRef<L.Map | null>(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      flyToReport: (reportId: string) => {
        const report = pendingReports.find((r) => r.id === reportId);
        if (report && mapRef.current) {
          const coords = parseCoordinates(report.coordinates);
          if (coords) {
            setDisplayMode("reports");
            mapRef.current.flyTo(coords, 16, { duration: 1.5 });
          }
        }
      },
      flyToRescue: (rescueId: string) => {
        const rescue = inProgressRescues.find((r) => r.id === rescueId);
        if (rescue && mapRef.current && rescue.reports?.[0]) {
          const coords = parseCoordinates(rescue.reports[0].coordinates);
          if (coords) {
            setDisplayMode("rescues");
            mapRef.current.flyTo(coords, 16, { duration: 1.5 });
          }
        }
      },
    }));

    // Calculate map center based on display mode
    useEffect(() => {
      const items =
        displayMode === "reports" ? pendingReports : inProgressRescues;

      if (displayMode === "reports") {
        const validReports = items.filter((r) =>
          parseCoordinates(r.coordinates)
        );
        if (validReports.length === 0) {
          setMapCenter([21.0285, 105.8542]);
          setMapZoom(13);
          return;
        }

        const sum = validReports.reduce(
          (acc, r) => {
            const coords = parseCoordinates(r.coordinates);
            if (coords) {
              const [lat, lng] = coords;
              acc.lat += lat;
              acc.lng += lng;
            }
            return acc;
          },
          { lat: 0, lng: 0 }
        );

        const avgLat = sum.lat / validReports.length;
        const avgLng = sum.lng / validReports.length;
        setMapCenter([avgLat, avgLng]);
        setMapZoom(validReports.length === 1 ? 15 : 11);
      } else {
        // For rescues, collect all report coordinates
        const allCoords: [number, number][] = [];
        inProgressRescues.forEach((rescue) => {
          rescue.reports?.forEach((report: any) => {
            const coords = parseCoordinates(report.coordinates);
            if (coords) {
              allCoords.push(coords);
            }
          });
        });

        if (allCoords.length === 0) {
          setMapCenter([21.0285, 105.8542]);
          setMapZoom(13);
          return;
        }

        const sum = allCoords.reduce(
          (acc, [lat, lng]) => {
            acc.lat += lat;
            acc.lng += lng;
            return acc;
          },
          { lat: 0, lng: 0 }
        );

        const avgLat = sum.lat / allCoords.length;
        const avgLng = sum.lng / allCoords.length;
        setMapCenter([avgLat, avgLng]);
        setMapZoom(allCoords.length === 1 ? 15 : 11);
      }
    }, [displayMode, pendingReports, inProgressRescues]);

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

    const reportIcon = createCustomIcon("#ff6b35");
    const rescueIcon = createCustomIcon("#4ecdc4");

    return (
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <Space>
              <EnvironmentOutlined
                style={{ color: "#10b981", fontSize: "1.25rem" }}
              />
              <Title
                level={4}
                style={{ margin: 0, fontFamily: "Inter, sans-serif" }}
              >
                Delivery Map
              </Title>
            </Space>
            <Radio.Group
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="reports">
                Pending Reports ({pendingReports.length})
              </Radio.Button>
              <Radio.Button value="rescues">
                In Progress Rescues ({inProgressRescues.length})
              </Radio.Button>
            </Radio.Group>
          </div>
        }
        style={{
          borderRadius: "1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        bodyStyle={{ padding: "0", height: "450px" }}
      >
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
        >
          <MapController center={mapCenter} zoom={mapZoom} mapRef={mapRef} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {displayMode === "reports" &&
            pendingReports.map((report) => {
              const coords = parseCoordinates(report.coordinates);
              if (!coords) return null;

              return (
                <Marker key={report.id} position={coords} icon={reportIcon}>
                  <Popup>
                    <div style={{ minWidth: "200px" }}>
                      <Title level={5} style={{ marginBottom: "8px" }}>
                        {report.title}
                      </Title>
                      <Space
                        direction="vertical"
                        size="small"
                        style={{ width: "100%" }}
                      >
                        <div>
                          <Text strong>Status: </Text>
                          <Tag color={getStatusColor(report.status ?? "")}>
                            {report.status}
                          </Tag>
                        </div>
                        <div>
                          <Text strong>Urgency: </Text>
                          <Tag
                            color={getUrgencyColor(report.urgency_level ?? "")}
                          >
                            {report.urgency_level}
                          </Tag>
                        </div>
                        <div>
                          <Text strong>Location: </Text>
                          <Text>{report.location}</Text>
                        </div>
                        {onShowReport && (
                          <Button
                            type="primary"
                            size="small"
                            block
                            onClick={() => onShowReport(report.id)}
                          >
                            View Details
                          </Button>
                        )}
                      </Space>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {displayMode === "rescues" &&
            inProgressRescues.map((rescue) => {
              return rescue.reports?.map((report: any) => {
                const coords = parseCoordinates(report.coordinates);
                if (!coords) return null;

                return (
                  <Marker
                    key={`${rescue.id}-${report.id}`}
                    position={coords}
                    icon={rescueIcon}
                  >
                    <Popup>
                      <div style={{ minWidth: "200px" }}>
                        <Title level={5} style={{ marginBottom: "8px" }}>
                          {rescue.title}
                        </Title>
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          <div>
                            <Text strong>Report: </Text>
                            <Text>{report.title}</Text>
                          </div>
                          <div>
                            <Text strong>Location: </Text>
                            <Text>{report.location}</Text>
                          </div>
                          {onShowRescue && (
                            <Button
                              type="primary"
                              size="small"
                              block
                              onClick={() => onShowRescue(rescue.id)}
                            >
                              View Rescue
                            </Button>
                          )}
                        </Space>
                      </div>
                    </Popup>
                  </Marker>
                );
              });
            })}
        </MapContainer>
      </Card>
    );
  }
);

DashboardMap.displayName = "DashboardMap";
