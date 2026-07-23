using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;
using Softlithe.ERP.DA.Examenes.ExamenSnapshot;
using System;
using System.Collections.Generic;

namespace Softlithe.ERP.DA.Modelos;

public partial class ContextoBasedeDatos : DbContext
{
    public ContextoBasedeDatos()
    {
    }

    public ContextoBasedeDatos(DbContextOptions<ContextoBasedeDatos> options)
        : base(options)
    {
    }
    public DbSet<ObtenerGraduacionPorSucursalSPDto> ObtenerGraduacionPorSucursalSPDto { get; set; }
    public virtual DbSet<GraduacionAD> GraduacionContexto { get; set; }
    public virtual DbSet<TipoGraduacionAD> TipoGraduacionContexto { get; set; }
    public virtual DbSet<SeguridadAccion> SeguridadAccions { get; set; }
    public virtual DbSet<TipoLenteAD> TipoLente { get; set; }
    public virtual DbSet<ExamenSnapshotAD> ExamenSnapshots { get; set; }
    public virtual DbSet<SeguridadOpcione> SeguridadOpciones { get; set; }
    public virtual DbSet<SeguridadRolAccione> SeguridadRolAcciones { get; set; }
    public virtual DbSet<SeguridadRolesUsuario> SeguridadRolesUsuarios { get; set; }
    public virtual DbSet<Paciente> Pacientes { get; set; }
	public virtual DbSet<Moneda> Monedas { get; set; }
    public virtual DbSet<ListaPrecioAD> ListaPrecioContexto { get; set; }
    public virtual DbSet<Bitacora> Bitacoras { get; set; }
    public virtual DbSet<Marca> Marcas { get; set; }
    public virtual DbSet<Pais> Paises { get; set; }
    public virtual DbSet<EnfermedadCatalogo> EnfermedadCatalogos { get; set; }
    public virtual DbSet<EnfermedadTipo> EnfermedadTipos { get; set; }
    public virtual DbSet<MonedaSucursal> MonedasSucursal { get; set; }
    public virtual DbSet<EnfermedadSucursal> Enfermedades { get; set; }
    public virtual DbSet<PacienteClasificacion> PacienteClasificaciones { get; set; }
    public virtual DbSet<Grupo> Grupos { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }
    public virtual DbSet<Seccion> Secciones { get; set; }
    public virtual DbSet<Modulo> Modulos { get; set; }
    public virtual DbSet<Permiso> Permisos { get; set; }
    public virtual DbSet<Rol> Roles { get; set; }
    public virtual DbSet<RolPermiso> RolPermisos { get; set; }
    public virtual DbSet<UsuarioRol> UsuarioRoles { get; set; }
    public virtual DbSet<Empresa> Empresas { get; set; }
    public virtual DbSet<Sucursal> Sucursales { get; set; }
    public virtual DbSet<EmpresaSucursal> EmpresaSucursales { get; set; }
    public virtual DbSet<UsuarioEmpresaSucursal> UsuarioEmpresaSucursales { get; set; }

    public virtual DbSet<EmpresaActividadEconomica> EmpresaActividadEconomicas { get; set; }

    public virtual DbSet<ParametroFacturacionEmpresa> ParametroFacturacionEmpresas { get; set; }

    public virtual DbSet<ParametroFacturacionSucursal> ParametroFacturacionSucursales { get; set; }

    public virtual DbSet<Bodega> Bodegas { get; set; }

    public virtual DbSet<Vendedor> Vendedores { get; set; }

    public virtual DbSet<Caja> Cajas { get; set; }

    public virtual DbSet<CajaCierre> CajaCierres { get; set; }

    public virtual DbSet<CajaMovimiento> CajaMovimientos { get; set; }

    public virtual DbSet<TipoMovimientoCaja> TiposMovimientoCaja { get; set; }

    public virtual DbSet<FormaPago> FormasPago { get; set; }

    public virtual DbSet<CajaCierreHistorial> CajaCierreHistoriales { get; set; }

    public virtual DbSet<ExistenciaBodega> ExistenciasBodega { get; set; }

    public virtual DbSet<ActividadEconomicaHacienda> ActividadEconomicaHaciendas { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SeguridadAccion>(entity =>
        {
            entity.Property(e => e.Descripcion).IsFixedLength();
        });


        modelBuilder.Entity<SeguridadOpcione>(entity =>
        {
            entity.Property(e => e.Descripcion).IsFixedLength();
        });

        modelBuilder.Entity<Bitacora>(entity =>
        {
            entity.ToTable("Bitacora");

            entity.HasKey(e => new { e.idBitacora, e.identificador });

            entity.Property(e => e.idBitacora).HasColumnName("no_bitacora");
            entity.Property(e => e.identificador).HasColumnName("identificador");
            entity.Property(e => e.usuario).HasColumnName("usuario");
            entity.Property(e => e.descripcionDelEvento).HasColumnName("descripcion_evento");
            entity.Property(e => e.fechaDeRegistro).HasColumnName("fecha_registro");
            entity.Property(e => e.nombreDelMetodo).HasColumnName("nombre_metodo");
            entity.Property(e => e.tabla).HasColumnName("tabla");
            entity.Property(e => e.mensajeExcepcion).HasColumnName("mensaje_excepcion");
            entity.Property(e => e.stackTrace).HasColumnName("stack_trace");
        });

        modelBuilder.Entity<Marca>(entity =>
        {
            entity.Property(e => e.NoMarca).ValueGeneratedOnAdd();
        });
        modelBuilder.Entity<EnfermedadCatalogo>(entity =>
        {
            entity.HasKey(e => e.IdEnfermedad).HasName("EnfermedadCatalogo_id_enfermedad_PK");
        });

        modelBuilder.Entity<UsuarioEmpresaSucursal>(entity =>
        {
            entity.HasKey(e => new { e.IdUsuario, e.Identificador });
            entity.HasOne(e => e.Usuario)
                .WithMany(u => u.UsuarioEmpresaSucursales)
                .HasForeignKey(e => e.IdUsuario)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.EmpresaSucursal)
                .WithMany(es => es.UsuarioEmpresaSucursales)
                .HasForeignKey(e => e.Identificador)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<EmpresaSucursal>(entity =>
        {
            entity.HasOne(e => e.Empresa)
                .WithMany(em => em.EmpresaSucursales)
                .HasForeignKey(e => e.NoEmpresa)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Sucursal)
                .WithMany(s => s.EmpresaSucursales)
                .HasForeignKey(e => e.NoSucursal)
                .OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<ExamenSnapshotAD>()
    .HasNoKey();
        modelBuilder.Entity<ObtenerGraduacionPorSucursalSPDto>()
           .HasNoKey();

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
