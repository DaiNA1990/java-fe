using System.Net;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel((hostingContext, serverOptions) =>
{
    var _args = Environment.GetCommandLineArgs();

    var httpPort = _args.Any(c => c.Contains("http-port"))
    ? _args.FirstOrDefault(c => c.Contains("http-port"))!.Split("=")[1]
    : Environment.GetEnvironmentVariable("ASPNETCORE_HTTP_PORT");

    var httpsPort = _args.Any(c => c.Contains("https-port"))
    ? _args.FirstOrDefault(c => c.Contains("https-port"))!.Split("=")[1]
    : Environment.GetEnvironmentVariable("ASPNETCORE_HTTPS_PORT");

    if (!string.IsNullOrEmpty(httpPort))
        serverOptions.Listen(IPAddress.Any, int.Parse(httpPort));
});

// Add services to the container.

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");


app.Run();
