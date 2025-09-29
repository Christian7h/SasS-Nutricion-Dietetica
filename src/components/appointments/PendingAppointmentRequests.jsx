import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Card from "../common/Card";
import Button from "../common/Button";
import Badge from "../common/Badge";
import Modal from "../common/Modal";
import { useNutritionistAppointments } from "../../hooks/useNutritionistAppointments";
import AppointmentDetailModal from "./AppointmentDetailModal";

export default function PendingAppointmentRequests() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    appointments,
    getPendingRequests,
    approveRequest,
    rejectRequest,
    isApproving,
    isRejecting,
    isLoading,
    error: fetchError,
  } = useNutritionistAppointments();

  const pendingRequests = getPendingRequests();

  // Debug logging
  console.log("🔍 PendingAppointmentRequests Debug:");
  console.log("📋 All appointments:", appointments);
  console.log("⏳ Pending requests:", pendingRequests);
  console.log("🔄 Is loading:", isLoading);
  console.log("❌ Fetch error:", fetchError);

  const handleApprove = (appointmentId) => {
    approveRequest(appointmentId);
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedRequest) {
      rejectRequest({
        appointmentId: selectedRequest._id,
        reason: rejectReason,
      });
      setRejectModalOpen(false);
      setSelectedRequest(null);
      setRejectReason("");
    }
  };
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsDetailModalOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="w-8 h-8 animate-spin border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-base-content/70">Cargando solicitudes...</p>
        </div>
      </Card>
    );
  }

  if (fetchError) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-lg font-medium text-error mb-2">
            Error al cargar solicitudes
          </h3>
          <p className="text-base-content/70 mb-4">
            {fetchError.message ||
              "No se pudieron cargar las solicitudes de citas"}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Recargar Página
          </Button>
        </div>
      </Card>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-8 h-8 text-base-content/50" />
          </div>
          <h3 className="text-lg font-medium text-base-content mb-2">
            No hay solicitudes pendientes
          </h3>
          <p className="text-base-content/70 mb-4">
            Las nuevas solicitudes de citas aparecerán aquí.
          </p>
          {/* Debug info en desarrollo */}
          {import.meta.env.DEV && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-base-content/50">
                Debug Info (Solo desarrollo)
              </summary>
              <div className="mt-2 p-3 bg-base-200 rounded text-xs">
                <p>
                  <strong>Total citas:</strong> {appointments?.length || 0}
                </p>
                <p>
                  <strong>Estados encontrados:</strong>{" "}
                  {appointments?.map((a) => a.status).join(", ") || "ninguno"}
                </p>
                <p>
                  <strong>IDs de citas:</strong>{" "}
                  {appointments?.map((a) => a._id || a.id).join(", ") ||
                    "ninguno"}
                </p>
                {appointments?.length > 0 && (
                  <div className="mt-2">
                    <p>
                      <strong>Detalles de citas:</strong>
                    </p>
                    {appointments.map((apt, index) => (
                      <div key={apt._id || index} className="ml-2 mt-1 text-xs">
                        <p>
                          • ID: {apt._id}, Status: {apt.status}, Paciente:{" "}
                          {apt.patientId?.name || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      </Card>
    );
  }

  return (
    
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <ExclamationTriangleIcon className="w-5 h-5 text-warning" />
        <h3 className="text-lg font-medium text-base-content">
          Solicitudes Pendientes ({pendingRequests.length})
        </h3>
      </div>

      {pendingRequests.map((request) => (
        <RequestCard
          key={request._id}
          request={request}
          onApprove={handleApprove}
          onReject={handleRejectClick}
          onViewDetails={handleViewDetails}
          isApproving={isApproving}
          isRejecting={isRejecting}
        />
      ))}

      {/* Modal de rechazo */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Rechazar Solicitud de Cita"
      >
        <div className="space-y-4">
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <XMarkIcon className="w-4 h-4 text-error" />
              <p className="font-medium text-error">Rechazar Solicitud</p>
            </div>
            <p className="text-sm text-base-content/70">
              El paciente será notificado del rechazo con el motivo que
              proporciones.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content mb-2">
              Motivo del rechazo (opcional)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="textarea textarea-bordered w-full"
              placeholder="Ej: No hay disponibilidad en esa fecha, conflicto de horario..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="error"
              onClick={handleRejectConfirm}
              loading={isRejecting}
            >
              Rechazar Solicitud
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de detalles */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

function RequestCard({
  request,
  onApprove,
  onReject,
  onViewDetails,
  isApproving,
  isRejecting,
}) {
  const requestDate = new Date(request.date);

  return (
    <div>
    <Card className="border-l-4 border-l-warning bg-warning/5">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="warning" size="sm">
              Solicitud Pendiente
            </Badge>
            <span className="text-xs text-base-content/70">
              Solicitada{" "}
              {format(new Date(request.createdAt), "dd/MM/yyyy HH:mm")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-base-content/70" />
              <span className="text-sm font-medium text-base-content">
                {request.patientId?.name || "Paciente"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-base-content/70" />
              <span className="text-sm text-base-content">
                {format(requestDate, "EEEE, d 'de' MMMM", { locale: es })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-base-content/70" />
              <span className="text-sm text-base-content">
                {request.time || "Hora no especificada"}
              </span>
            </div>
            <div>
              <Badge variant="info" size="sm">
                {request.type === "consultation"
                  ? "Consulta"
                  : request.type === "follow-up"
                  ? "Seguimiento"
                  : request.type === "initial"
                  ? "Primera Consulta"
                  : request.type === "control"
                  ? "Control"
                  : request.type || "Consulta"}
              </Badge>
            </div>
          </div>

          {request.reason && (
            <div className="bg-base-100 rounded-lg p-3 mb-3">
              <p className="text-sm text-base-content/70">
                <strong>Motivo:</strong> {request.reason}
              </p>
            </div>
          )}

          {request.notes && (
            <div className="bg-base-100 rounded-lg p-3 mb-3">
              <p className="text-sm text-base-content/70">
                <strong>Notas:</strong> {request.notes}
              </p>
            </div>
          )}

          {request.patientNotes && (
            <div className="bg-base-100 rounded-lg p-3">
              <p className="text-sm text-base-content/70">
                <strong>Notas adicionales:</strong> {request.patientNotes}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 ml-4">
          <Button
            variant="success"
            size="sm"
            onClick={() => onApprove(request._id)}
            disabled={isApproving || isRejecting}
            loading={isApproving}
            className="flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            {isApproving ? "Aprobando..." : "Aprobar"}
          </Button>

          <Button
            variant="error"
            size="sm"
            onClick={() => onReject(request)}
            disabled={isApproving || isRejecting}
            className="flex items-center gap-2"
          >
            <XMarkIcon className="w-4 h-4" />
            Rechazar
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => onViewDetails(request)}
          >
            <EyeIcon className="w-4 h-4" />
            Ver Detalles
          </Button>
          
        </div>
        
      </div>
      
    </Card>
    </div>
  );
}
