from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class ConfigHistory(Base):
    __tablename__ = "config_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    task_id = Column(String(100), unique=True, index=True, nullable=False)
    input_config = Column(JSON, nullable=False)
    nic_recommendation = Column(JSON, nullable=True)
    network_design = Column(JSON, nullable=True)
    bom_list = Column(JSON, nullable=True)
    validation_report = Column(JSON, nullable=True)
    session_id = Column(String(100), nullable=True, index=True)
    status = Column(String(50), nullable=False, default="processing")
    error_message = Column(Text, nullable=True)


class KnowledgeBase(Base):
    __tablename__ = "knowledge_base"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_url = Column(String(500), nullable=True)
    title = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)
    content = Column(Text, nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    vector_id = Column(String(100), nullable=True, index=True)
