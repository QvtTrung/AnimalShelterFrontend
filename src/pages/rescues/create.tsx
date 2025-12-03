// src/pages/rescue/create.tsx
import { Create, useForm } from "@refinedev/antd";
import { IRescue, IRescueParticipant, IRescueReport } from "../../interfaces";
import { RescueForm } from "../../components/Forms/RescueForm";
import { useState } from "react";
import { message } from "antd";
import { useApi } from "../../hooks/useApi";
import { useNavigation } from "@refinedev/core";

export const RescueCreate = () => {
  const { formProps } = useForm<IRescue>({
    warnWhenUnsavedChanges: false,
  });
  const { list } = useNavigation();

  const [participants, setParticipants] = useState<IRescueParticipant[]>([]);
  const [reports, setReports] = useState<IRescueReport[]>([]);

  const { useApiMutation } = useApi();

  // Mutation for creating rescue
  const createRescue = useApiMutation("", "", {
    onSuccess: () => {
      message.success("Đã tạo chiến dịch cứu hộ thành công");
    },
    onError: (error: any) => {
      console.error("Error creating rescue:", error);
      message.error("Không thể tạo chiến dịch cứu hộ");
    },
  });

  // Mutation for adding participants
  const addParticipant = useApiMutation("", "", {
    onError: (error: any) => {
      console.error("Error adding participant:", error);
      message.error("Không thể thêm thành viên");
    },
  });

  // Mutation for adding reports
  const addReport = useApiMutation("", "", {
    onError: (error: any) => {
      console.error("Error adding report:", error);
      message.error("Không thể thêm báo cáo");
    },
  });

  // Chuyển đổi dữ liệu submit nếu cần
  const handleSubmit = async (values: IRescue) => {
    // First, create the rescue
    const rescueData = {
      title: values.title,
      description: values.description,
      required_participants: Number(values.required_participants),
      status: values.status,
    };

    try {
      // Create rescue first
      const rescueResponse = await createRescue.mutateAsync({
        url: "/rescues",
        method: "post",
        values: rescueData,
      });

      const rescueId = rescueResponse.data.data.id;

      // Add participants
      if (participants.length > 0) {
        for (const participant of participants) {
          await addParticipant.mutateAsync({
            url: `/rescues/${rescueId}/participants`,
            method: "post",
            values: {
              users_id: participant.users_id,
              role: participant.role,
            },
          });
        }
      }

      // Add reports
      if (reports.length > 0) {
        for (const report of reports) {
          await addReport.mutateAsync({
            url: `/rescues/${rescueId}/reports`,
            method: "post",
            values: {
              reports_id: report.reports_id,
              status: report.status || "in_progress",
            },
          });
        }
      }

      message.success("Đã tạo chiến dịch cứu hộ và các liên kết thành công");

      // Redirect to list page using Refine's navigation
      list("rescues");
    } catch (error) {
      console.error("Error creating rescue:", error);
      message.error("Không thể tạo chiến dịch cứu hộ");
    }
  };

  return (
    <Create saveButtonProps={{ hidden: true }}>
      <RescueForm
        formProps={{ ...formProps, onFinish: handleSubmit }}
        participants={participants}
        setParticipants={setParticipants}
        reports={reports}
        setReports={setReports}
      />
    </Create>
  );
};
