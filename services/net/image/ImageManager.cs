using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TNO.Services.Managers;
using TNO.Services.Image.Config;

namespace TNO.Services.Image;

/// <summary>
/// ImageManager class, provides a way to manage the image service.
/// </summary>
public class ImageManager : IngestManager<ImageIngestActionManager, ImageOptions>
{
    #region Constructors
    /// <summary>
    /// Creates a new instance of a ImageManager object, initializes with specified parameters.
    /// </summary>
    /// <param name="serviceProvider"></param>
    /// <param name="api"></param>
    /// <param name="factory"></param>
    /// <param name="options"></param>
    /// <param name="logger"></param>
    public ImageManager(
        IServiceProvider serviceProvider,
        IApiService api,
        IngestManagerFactory<ImageIngestActionManager, ImageOptions> factory,
        IOptions<ImageOptions> options,
        ILogger<ImageManager> logger)
        : base(serviceProvider, api, factory, options, logger)
    {
    }
    #endregion
}
