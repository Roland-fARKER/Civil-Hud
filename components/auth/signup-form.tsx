"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [cedula, setCedula] = useState("");
  const [company, setCompany] = useState("");
  const [userType, setUserType] = useState<
    "client" | "contractor" | "supplier"
  >("client");

  const [departments, setDepartments] = useState<any[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedMun, setSelectedMun] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = getSupabaseBrowserClient();

  // 🔹 Cargar departamentos
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("departments").select("*");
      if (!error && data) setDepartments(data);
    };
    fetchDepartments();
  }, [supabase]);

  // 🔹 Cargar municipios cuando cambia el departamento
  useEffect(() => {
    const fetchMunicipalities = async () => {
      if (!selectedDept) return;
      const { data, error } = await supabase
        .from("municipalities")
        .select("*")
        .eq("department_id", selectedDept);
      if (!error && data) setMunicipalities(data);
    };
    fetchMunicipalities();
  }, [selectedDept, supabase]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Crear usuario en Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const user = data.user;
      if (user) {
        // 2️⃣ Guardar perfil en tabla profiles
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          phone,
          user_type: userType,
          cedula,
          company_name: company,
          department_id: selectedDept ? Number(selectedDept) : null,
          municipality_id: selectedMun ? Number(selectedMun) : null,
        });

        if (profileError) {
          toast({
            title: "Error al guardar el perfil",
            description: profileError.message,
            variant: "destructive",
          });
          return;
        }
      }

      // 3️⃣ Notificar éxito
      toast({
        title: "Cuenta creada",
        description:
          "Por favor revisa tu correo electrónico para verificar tu cuenta.",
      });

      // 4️⃣ Redirigir si la confirmación está deshabilitada
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al crear la cuenta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {/* Nombres y Apellidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-[#234766]">
            Nombres
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Juan Carlos"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-[#234766]">
            Apellidos
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="López Martínez"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
          />
        </div>
      </div>

      {/* Cédula */}
      <div className="space-y-2">
        <Label htmlFor="cedula" className="text-[#234766]">
          Cédula (ejemplo: 041-020903-1002Y)
        </Label>
        <Input
          id="cedula"
          type="text"
          placeholder="041-020903-1002Y"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          pattern="\d{3}-\d{6}-\d{4}[A-Z]"
          title="Formato: 041-020903-1002Y"
          required
          className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
        />
      </div>

      {/* Empresa */}
      <div className="space-y-2">
        <Label htmlFor="company" className="text-[#234766]">
          Empresa
        </Label>
        <Input
          id="company"
          type="text"
          placeholder="Nombre de la empresa"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
        />
      </div>

      {/* Departamento */}
      <div className="space-y-2">
        <Label className="text-[#234766]">Departamento</Label>
        <Select value={selectedDept} onValueChange={setSelectedDept}>
          <SelectTrigger className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]">
            <SelectValue placeholder="Selecciona un departamento" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d.id} value={String(d.id)}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Municipio */}
      <div className="space-y-2">
        <Label className="text-[#234766]">Municipio</Label>
        <Select
          value={selectedMun}
          onValueChange={setSelectedMun}
          disabled={!selectedDept}
        >
          <SelectTrigger className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]">
            <SelectValue placeholder="Selecciona un municipio" />
          </SelectTrigger>
          <SelectContent>
            {municipalities.map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Teléfono */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-[#234766]">
          Número de teléfono
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+505 8888 8888"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
        />
      </div>

      {/* Tipo de usuario */}
      <div className="space-y-2">
        <Label htmlFor="userType" className="text-[#234766]">
          Soy un
        </Label>
        <Select
          value={userType}
          onValueChange={(value: any) => setUserType(value)}
        >
          <SelectTrigger className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]">
            <SelectValue placeholder="Selecciona tu rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">
              Cliente (Propietario del proyecto)
            </SelectItem>
            <SelectItem value="contractor">Contratista</SelectItem>
            <SelectItem value="supplier">Proveedor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#234766]">
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
        />
      </div>

      {/* Contraseña */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#234766]">
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
        />
        <p className="text-xs text-[#8d99ae]">
          Debe tener al menos 6 caracteres
        </p>
      </div>

      {/* Botón */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          "Crear cuenta"
        )}
      </Button>
    </form>
  );
}
