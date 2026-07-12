using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Rol> Roles { get; set; }

        public DbSet<RecuperacionPassword> RecuperacionesPassword { get; set; }

        public DbSet<Campana> Campanas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==========================
            // TABLA USUARIOS
            // ==========================
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

            // ==========================
            // TABLA ROLES
            // ==========================
            modelBuilder.Entity<Rol>(entity =>
            {
                entity.ToTable("Roles");

                entity.HasKey(r => r.IdRol);

                entity.Property(r => r.IdRol)
                    .HasColumnName("id_rol");

                entity.Property(r => r.Nombre)
                    .HasColumnName("nombre");
            });

            // ==========================
            // TABLA RECUPERACION PASSWORD
            // ==========================
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

            // ==========================
            // TABLA CAMPAÑAS
            // ==========================
            modelBuilder.Entity<Campana>(entity =>
            {
                entity.ToTable("Campanas");

                entity.HasKey(c => c.IdCampana);

                entity.Property(c => c.IdCampana)
                    .HasColumnName("id_campana");

                entity.Property(c => c.Nombre)
                    .HasColumnName("nombre");

                entity.Property(c => c.Descripcion)
                    .HasColumnName("descripcion");

                entity.Property(c => c.FechaInicio)
                    .HasColumnName("fecha_inicio");

                entity.Property(c => c.FechaFin)
                    .HasColumnName("fecha_fin");

                entity.Property(c => c.Presupuesto)
                    .HasColumnName("presupuesto");

                entity.Property(c => c.Estado)
                    .HasColumnName("estado");

                entity.Property(c => c.IdUsuario)
                    .HasColumnName("id_usuario");
            });

            // ==========================
            // RELACIÓN USUARIO -> ROL
            // ==========================
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Rol)
                .WithMany(r => r.Usuarios)
                .HasForeignKey(u => u.IdRol);

            // ==========================
            // RELACIÓN RECUPERACIÓN -> USUARIO
            // ==========================
            modelBuilder.Entity<RecuperacionPassword>()
                .HasOne(r => r.Usuario)
                .WithMany()
                .HasForeignKey(r => r.IdUsuario);

            // ==========================
            // RELACIÓN CAMPAÑA -> USUARIO
            // ==========================
            modelBuilder.Entity<Campana>()
                .HasOne(c => c.Usuario)
                .WithMany()
                .HasForeignKey(c => c.IdUsuario);
        }
    }
} 