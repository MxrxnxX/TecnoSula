    using Backend.Models;
    using Microsoft.EntityFrameworkCore;

    namespace Backend.Data
    {
        public class AppDbContext : DbContext
        {
            public AppDbContext(
                DbContextOptions<AppDbContext> options
            ) : base(options)
            {
            }

            // =====================================================
            // TABLAS EXISTENTES
            // =====================================================

            public DbSet<Usuario> Usuarios { get; set; } = null!;

            public DbSet<Rol> Roles { get; set; } = null!;

            public DbSet<RecuperacionPassword>
                RecuperacionesPassword { get; set; } = null!;

            public DbSet<Campana> Campanas { get; set; } = null!;

            // =====================================================
            // TABLAS DE PUBLICACIÓN Y PROGRAMACIÓN
            // =====================================================

            public DbSet<Publicacion>
                Publicaciones { get; set; } = null!;

            public DbSet<RedSocial>
                RedesSociales { get; set; } = null!;

            public DbSet<PublicacionRedSocial>
                PublicacionRedesSociales { get; set; } = null!;

            protected override void OnModelCreating(
                ModelBuilder modelBuilder
            )
            {
                base.OnModelCreating(modelBuilder);

                // =================================================
                // TABLA USUARIOS
                // =================================================

                modelBuilder.Entity<Usuario>(entity =>
                {
                    entity.ToTable("Usuarios");

                    entity.HasKey(u => u.IdUsuario);

                    entity.Property(u => u.IdUsuario)
                        .HasColumnName("id_usuario");

                    entity.Property(u => u.Nombre)
                        .HasColumnName("nombre");

                    entity.Property(u => u.Apellido)
                        .HasColumnName("apellido");

                    entity.Property(u => u.Correo)
                        .HasColumnName("correo");

                    entity.Property(u => u.Contrasena)
                        .HasColumnName("contrasena");

                    entity.Property(u => u.Telefono)
                        .HasColumnName("telefono");

                    entity.Property(u => u.Estado)
                        .HasColumnName("estado");

                    entity.Property(u => u.IdRol)
                        .HasColumnName("id_rol");
                });

                // =================================================
                // TABLA ROLES
                // =================================================

                modelBuilder.Entity<Rol>(entity =>
                {
                    entity.ToTable("Roles");

                    entity.HasKey(r => r.IdRol);

                    entity.Property(r => r.IdRol)
                        .HasColumnName("id_rol");

                    entity.Property(r => r.Nombre)
                        .HasColumnName("nombre");
                });

                // =================================================
                // TABLA RECUPERACIÓN PASSWORD
                // =================================================

                modelBuilder.Entity<RecuperacionPassword>(entity =>
                {
                    entity.ToTable("RecuperacionPassword");

                    entity.HasKey(r => r.IdRecuperacion);

                    entity.Property(r => r.IdRecuperacion)
                        .HasColumnName("id_recuperacion");

                    entity.Property(r => r.IdUsuario)
                        .HasColumnName("id_usuario");

                    entity.Property(r => r.Token)
                        .HasColumnName("token");

                    entity.Property(r => r.FechaExpiracion)
                        .HasColumnName("fecha_expiracion");

                    entity.Property(r => r.Usado)
                        .HasColumnName("usado");
                });

                // =================================================
                // TABLA CAMPAÑAS
                // =================================================

                modelBuilder.Entity<Campana>(entity =>
                {
                    entity.ToTable("Campanas");

                    entity.HasKey(c => c.IdCampana);

                    entity.Property(c => c.IdCampana)
                        .HasColumnName("id_campana");

                    entity.Property(c => c.Nombre)
                        .HasColumnName("nombre")
                        .HasMaxLength(100)
                        .IsRequired();

                    entity.Property(c => c.Descripcion)
                        .HasColumnName("descripcion")
                        .HasMaxLength(255);

                    entity.Property(c => c.FechaInicio)
                        .HasColumnName("fecha_inicio")
                        .IsRequired();

                    entity.Property(c => c.FechaFin)
                        .HasColumnName("fecha_fin")
                        .IsRequired();

                    entity.Property(c => c.Presupuesto)
                        .HasColumnName("presupuesto")
                        .HasPrecision(18, 2);

                    entity.Property(c => c.Progreso)
                        .HasColumnName("progreso")
                        .HasDefaultValue(0)
                        .IsRequired();

                    entity.Property(c => c.Estado)
                        .HasColumnName("estado")
                        .HasMaxLength(20)
                        .HasDefaultValue("Activa")
                        .IsRequired();

                    entity.Property(c => c.IdUsuario)
                        .HasColumnName("id_usuario")
                        .IsRequired();
                });

                // =================================================
                // TABLA PUBLICACIONES
                // =================================================

                modelBuilder.Entity<Publicacion>(entity =>
                {
                    entity.ToTable("Publicaciones");

                    entity.HasKey(p => p.IdPublicacion);

                    entity.Property(p => p.IdPublicacion)
                        .HasColumnName("id_publicacion");

                    entity.Property(p => p.Titulo)
                        .HasColumnName("titulo")
                        .HasMaxLength(150)
                        .IsRequired();

                    entity.Property(p => p.Descripcion)
                        .HasColumnName("descripcion")
                        .HasMaxLength(1000)
                        .IsRequired();

                    entity.Property(p => p.TipoMultimedia)
                        .HasColumnName("tipo_multimedia")
                        .HasMaxLength(30);

                    entity.Property(p => p.UrlMultimedia)
                        .HasColumnName("url_multimedia")
                        .HasMaxLength(500);

                    entity.Property(p => p.FechaProgramacion)
                        .HasColumnName("fecha_programacion")
                        .HasColumnType("datetime2(0)");

                    entity.Property(p => p.Estado)
                        .HasColumnName("estado")
                        .HasMaxLength(20)
                        .HasDefaultValue("Borrador")
                        .IsRequired();

                    entity.Property(p => p.IdCampana)
                        .HasColumnName("id_campana")
                        .IsRequired();

                    entity.Property(p => p.IdUsuario)
                        .HasColumnName("id_usuario")
                        .IsRequired();

                    entity.Property(p => p.FechaCreacion)
                        .HasColumnName("fecha_creacion")
                        .HasColumnType("datetime2(0)")
                        .HasDefaultValueSql("SYSDATETIME()")
                        .ValueGeneratedOnAdd();

                    entity.Property(p => p.FechaActualizacion)
                        .HasColumnName("fecha_actualizacion")
                        .HasColumnType("datetime2(0)");

                    entity.HasIndex(p => p.IdCampana)
                        .HasDatabaseName(
                            "IX_Publicaciones_IdCampana"
                        );

                    entity.HasIndex(p => p.Estado)
                        .HasDatabaseName(
                            "IX_Publicaciones_Estado"
                        );

                    entity.HasIndex(p => p.FechaProgramacion)
                        .HasDatabaseName(
                            "IX_Publicaciones_FechaProgramacion"
                        );
                });

                // =================================================
                // TABLA REDES SOCIALES
                // =================================================

                modelBuilder.Entity<RedSocial>(entity =>
                {
                    entity.ToTable("RedesSociales");

                    entity.HasKey(r => r.IdRedSocial);

                    entity.Property(r => r.IdRedSocial)
                        .HasColumnName("id_red_social");

                    entity.Property(r => r.Nombre)
                        .HasColumnName("nombre")
                        .HasMaxLength(50)
                        .IsRequired();

                    entity.Property(r => r.Estado)
                        .HasColumnName("estado")
                        .HasDefaultValue(true)
                        .IsRequired();

                    entity.HasIndex(r => r.Nombre)
                        .IsUnique()
                        .HasDatabaseName(
                            "UQ_RedesSociales_Nombre"
                        );
                });

                // =================================================
                // TABLA INTERMEDIA PUBLICACIÓN - RED SOCIAL
                // =================================================

                modelBuilder.Entity<PublicacionRedSocial>(entity =>
                {
                    entity.ToTable("PublicacionRedSocial");

                    entity.HasKey(pr => new
                    {
                        pr.IdPublicacion,
                        pr.IdRedSocial
                    });

                    entity.Property(pr => pr.IdPublicacion)
                        .HasColumnName("id_publicacion");

                    entity.Property(pr => pr.IdRedSocial)
                        .HasColumnName("id_red_social");
                });

                // =================================================
                // RELACIÓN USUARIO -> ROL
                // =================================================

                modelBuilder.Entity<Usuario>()
                    .HasOne(u => u.Rol)
                    .WithMany(r => r.Usuarios)
                    .HasForeignKey(u => u.IdRol);

                // =================================================
                // RELACIÓN RECUPERACIÓN -> USUARIO
                // =================================================

                modelBuilder.Entity<RecuperacionPassword>()
                    .HasOne(r => r.Usuario)
                    .WithMany()
                    .HasForeignKey(r => r.IdUsuario);

                // =================================================
                // RELACIÓN CAMPAÑA -> USUARIO
                // =================================================

                modelBuilder.Entity<Campana>()
                    .HasOne(c => c.Usuario)
                    .WithMany()
                    .HasForeignKey(c => c.IdUsuario)
                    .OnDelete(DeleteBehavior.Restrict);

                // =================================================
                // RELACIÓN PUBLICACIÓN -> CAMPAÑA
                // =================================================

                modelBuilder.Entity<Publicacion>()
                    .HasOne(p => p.Campana)
                    .WithMany()
                    .HasForeignKey(p => p.IdCampana)
                    .OnDelete(DeleteBehavior.Restrict);

                // =================================================
                // RELACIÓN PUBLICACIÓN -> USUARIO
                // =================================================

                modelBuilder.Entity<Publicacion>()
                    .HasOne(p => p.Usuario)
                    .WithMany()
                    .HasForeignKey(p => p.IdUsuario)
                    .OnDelete(DeleteBehavior.Restrict);

                // =================================================
                // RELACIÓN PUBLICACIÓN -> PUBLICACIÓN RED SOCIAL
                // =================================================

                modelBuilder.Entity<PublicacionRedSocial>()
                    .HasOne(pr => pr.Publicacion)
                    .WithMany(
                        p => p.PublicacionRedesSociales
                    )
                    .HasForeignKey(
                        pr => pr.IdPublicacion
                    )
                    .OnDelete(DeleteBehavior.Cascade);

                // =================================================
                // RELACIÓN RED SOCIAL -> PUBLICACIÓN RED SOCIAL
                // =================================================

                modelBuilder.Entity<PublicacionRedSocial>()
                    .HasOne(pr => pr.RedSocial)
                    .WithMany(
                        r => r.PublicacionRedesSociales
                    )
                    .HasForeignKey(
                        pr => pr.IdRedSocial
                    )
                    .OnDelete(DeleteBehavior.Restrict);
            }
        }
    }