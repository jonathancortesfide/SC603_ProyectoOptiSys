using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Softlithe.ERP.DA.Modelos;

public partial class ContextoBDD : DbContext
{
    public ContextoBDD()
    {
    }

    public ContextoBDD(DbContextOptions<ContextoBDD> options)
        : base(options)
    {
    }

    public virtual DbSet<ListaPrecioAD> ListaPrecios { get; set; }

    public virtual DbSet<TipoLenteAD> TipoLentes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=desarrollo-lenssys.database.windows.net;Database=dbDesarrollo ;Trusted_Connection=false;User Id=dbUserDesarrollo;password=Zxcv2023*;MultipleActiveResultSets=true;Trust Server Certificate=true");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
