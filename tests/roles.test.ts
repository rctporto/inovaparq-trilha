import { describe, expect, it } from "vitest";
import { areasFor, canManage, grantableRoles, homeFor, type Role, type UserStatus } from "@/lib/roles";

const p = (id: string, role: Role, status: UserStatus = "ATIVO") => ({ id, role, status });

describe("áreas por papel", () => {
  it("participante só acessa a própria área", () => {
    expect(areasFor("PARTICIPANTE")).toEqual(["participante"]);
    expect(homeFor("PARTICIPANTE")).toBe("/inicio");
  });
  it("mentor não acessa administração", () => {
    expect(areasFor("MENTOR")).not.toContain("admin");
  });
  it("admin não abre a área do participante", () => {
    expect(areasFor("ADMIN")).toEqual(["admin"]);
  });
  it("desenvolvedor acessa todas as áreas", () => {
    expect(areasFor("DESENVOLVEDOR")).toEqual(["participante", "mentor", "admin"]);
    expect(homeFor("DESENVOLVEDOR")).toBe("/admin");
  });
});

describe("aprovação de contas", () => {
  const pending = p("u1", "PARTICIPANTE", "PENDENTE");

  it("admin aprova como participante ou mentor", () => {
    expect(canManage(p("a", "ADMIN"), pending, "PARTICIPANTE").ok).toBe(true);
    expect(canManage(p("a", "ADMIN"), pending, "MENTOR").ok).toBe(true);
  });
  it("admin não concede administrador nem desenvolvedor", () => {
    expect(canManage(p("a", "ADMIN"), pending, "ADMIN").ok).toBe(false);
    expect(canManage(p("a", "ADMIN"), pending, "DESENVOLVEDOR").ok).toBe(false);
  });
  it("desenvolvedor concede qualquer papel", () => {
    for (const r of grantableRoles("DESENVOLVEDOR")) expect(canManage(p("d", "DESENVOLVEDOR"), pending, r).ok).toBe(true);
  });
  it("admin não altera outra conta de administração", () => {
    expect(canManage(p("a", "ADMIN"), p("b", "ADMIN")).ok).toBe(false);
    expect(canManage(p("a", "ADMIN"), p("d", "DESENVOLVEDOR")).ok).toBe(false);
  });
  it("ninguém altera a própria conta", () => {
    expect(canManage(p("d", "DESENVOLVEDOR"), p("d", "DESENVOLVEDOR"), "PARTICIPANTE").ok).toBe(false);
  });
  it("participante e mentor não aprovam", () => {
    expect(canManage(p("x", "PARTICIPANTE"), pending, "PARTICIPANTE").ok).toBe(false);
    expect(canManage(p("x", "MENTOR"), pending, "PARTICIPANTE").ok).toBe(false);
  });
  it("aprovador inativo ou pendente não aprova", () => {
    expect(canManage(p("a", "ADMIN", "INATIVO"), pending, "PARTICIPANTE").ok).toBe(false);
    expect(canManage(p("a", "DESENVOLVEDOR", "PENDENTE"), pending, "PARTICIPANTE").ok).toBe(false);
  });
});
