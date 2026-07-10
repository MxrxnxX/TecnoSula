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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<RecuperacionPassword>()
    .ToTable("RecuperacionPassword");

modelBuilder.Entity<RecuperacionPassword>()
    .HasKey(r => r.IdRecuperacion);

modelBuilder.Entity<RecuperacionPassword>()
    .Property(r => r.IdRecuperacion)
    .HasColumnName("id_recuperacion");


modelBuilder.Entity<RecuperacionPassword>()
    .HasOne(r => r.Usuario)
    .WithMany()
    .HasForeignKey(r => r.IdUsuario);

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
        }
    }
}