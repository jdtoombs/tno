using TNO.API.Models;

namespace TNO.API.Areas.Admin.Models.Series;

/// <summary>
/// SeriesModel class, provides a model that represents an series.
/// </summary>
public class SeriesModel : AuditColumnsModel
{
    #region Properties
    /// <summary>
    /// get/set - The primary key of the series.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// get/set - Foreign key to source.
    /// </summary>
    public int? SourceId { get; set; }

    /// <summary>
    /// get/set - The source.
    /// </summary>
    public SourceModel? Source { get; set; }

    /// <summary>
    /// get/set - The unique name of the model.
    /// </summary>
    public string Name { get; set; } = "";

    /// <summary>
    /// get/set - A description of the series.
    /// </summary>
    public string Description { get; set; } = "";

    /// <summary>
    /// get/set - Whether this model is enabled.
    /// </summary>
    public bool IsEnabled { get; set; }

    /// <summary>
    /// get/set - The sort order of the models.
    /// </summary>
    public int SortOrder { get; set; }

    /// <summary>
    /// get/set - Whether content should be automatically transcribed.
    /// </summary>
    public bool AutoTranscribe { get; set; }

    /// <summary>
    /// get/set - Whether to show the topics on the content form.
    /// </summary>
    public bool UseInTopics { get; set; }
    #endregion

    #region Constructors
    /// <summary>
    /// Creates a new instance of an SeriesModel.
    /// </summary>
    public SeriesModel() { }

    /// <summary>
    /// Creates a new instance of an SeriesModel, initializes with specified parameter.
    /// </summary>
    /// <param name="entity"></param>
    public SeriesModel(Entities.Series entity) : base(entity)
    {
        this.Id = entity.Id;
        this.SourceId = entity.SourceId;
        this.Source = entity.Source != null ? new SourceModel(entity.Source) : null;
        this.Name = entity.Name;
        this.Description = entity.Description;
        this.SortOrder = entity.SortOrder;
        this.IsEnabled = entity.IsEnabled;
        this.AutoTranscribe = entity.AutoTranscribe;
        this.UseInTopics = entity.UseInTopics;
    }
    #endregion

    #region Methods
    /// <summary>
    /// Explicit conversion to entity.
    /// </summary>
    /// <param name="model"></param>
    public static explicit operator Entities.Series(SeriesModel model)
    {
        var entity = new Entities.Series(model.Name, model.SourceId)
        {
            Id = model.Id,
            Description = model.Description,
            IsEnabled = model.IsEnabled,
            SortOrder = model.SortOrder,
            AutoTranscribe = model.AutoTranscribe,
            UseInTopics = model.UseInTopics,
            Version = model.Version ?? 0,
        };
        return entity;
    }
    #endregion
}
