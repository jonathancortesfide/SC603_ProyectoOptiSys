using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

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
    public virtual DbSet<SeguridadAccion> SeguridadAccions { get; set; }
    public virtual DbSet<TipoLenteAD> TipoLente { get; set; }

    public virtual DbSet<SeguridadOpcione> SeguridadOpciones { get; set; }
    public virtual DbSet<SeguridadRolAccione> SeguridadRolAcciones { get; set; }
    public virtual DbSet<SeguridadRolesUsuario> SeguridadRolesUsuarios { get; set; }
    public virtual DbSet<Paciente> Pacientes { get; set; }
	public virtual DbSet<Moneda> Monedas { get; set; }
    public virtual DbSet<ListaPrecioAD> ListaPrecioContexto { get; set; }
    public virtual DbSet<Bitacora> Bitacoras { get; set; }
    public virtual DbSet<Marca> Marcas { get; set; }
    public virtual DbSet<EnfermedadCatalogo> EnfermedadCatalogos { get; set; }
    public virtual DbSet<MonedaSucursal> MonedasSucursal { get; set; }
    public virtual DbSet<EnfermedadSucursal> Enfermedades { get; set; }
    public virtual DbSet<PacienteClasificacion> PacienteClasificaciones { get; set; }
    public virtual DbSet<Grupo> Grupos { get; set; }



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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
