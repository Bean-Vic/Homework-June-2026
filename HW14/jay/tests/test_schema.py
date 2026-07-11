from app.schema import GarmentAttributes, ClassificationResult, UploadContext


def test_garment_attributes_defaults():
    a = GarmentAttributes()
    assert a.garment_type is None
    assert a.color_palette == []


def test_classification_result_nests_attributes():
    r = ClassificationResult(description="a red dress", attributes=GarmentAttributes(garment_type="dress"))
    assert r.description == "a red dress"
    assert r.attributes.garment_type == "dress"


def test_upload_context_types():
    c = UploadContext(country="Italy", year=2024, month=6)
    assert c.country == "Italy"
    assert c.year == 2024
